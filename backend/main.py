from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import List
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.metrics import mean_squared_error
import logging
import io
from fastapi.staticfiles import StaticFiles
import os


from model_utils import prepare_data, build_lstm
from indicators import moving_average, calculate_rsi

# Initialize FastAPI app
app = FastAPI(
    title="Stock Trend Predictor API",
    description="LSTM-based stock price prediction with real-time data",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============== Pydantic Models ==============
class ComparisonResponse(BaseModel):
    symbols: List[str]
    dates: List[str]
    prices: dict
    start_date: str
    end_date: str


class PredictionResponse(BaseModel):
    symbol: str
    predictions: List[float]
    actual: List[float]
    future_dates: List[str]
    rmse: float
    latest_close: float
    ma: List[float]
    rsi: List[float]
    dates: List[str]


class StatsResponse(BaseModel):
    symbol: str
    open_price: float
    prev_close: float
    high_52w: float
    low_52w: float
    volume: float
    latest_close: float
    ma_20: float
    rsi_14: float


# ============== Helper Functions ==============
def fetch_stock_data(symbol: str, start_date: str, end_date: str):
    """Fetch stock data from Yahoo Finance with retry logic"""
    try:
        # Try to download with timeout and retry
        data = yf.download(
            symbol, 
            start=start_date, 
            end=end_date, 
            progress=False,
            timeout=10
        )
        
        if data.empty:
            raise ValueError(f"No data found for symbol {symbol}")
        
        # Handle single stock returning Series instead of DataFrame
        if isinstance(data, pd.Series):
            data = data.to_frame()
            
        return data
    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {e}")
        raise HTTPException(
            status_code=400, 
            detail=f"Failed to fetch data for {symbol}. Please check the symbol format. {str(e)}"
        )


def generate_future_dates(last_date, num_days: int):
    """Generate future weekday dates for predictions"""
    future_dates = []
    current = pd.Timestamp(last_date) + pd.Timedelta(days=1)
    
    while len(future_dates) < num_days:
        if current.weekday() < 5:  # Monday=0 to Friday=4
            future_dates.append(current)
        current += pd.Timedelta(days=1)
    
    return future_dates


def calculate_stats(data):
    """Calculate key statistics"""
    latest_row = data.iloc[-1]
    prev_close = data['Close'].iloc[-2] if len(data) >= 2 else latest_row['Close']
    window_52w = data.tail(252) if len(data) > 252 else data
    
    stats = {
        'open_price': float(latest_row.get('Open', 0)),
        'prev_close': float(prev_close),
        'high_52w': float(window_52w['High'].max()),
        'low_52w': float(window_52w['Low'].min()),
        'volume': float(latest_row.get('Volume', 0)),
        'latest_close': float(latest_row['Close']),
        'ma_20': float(data['MA'].iloc[-1]) if 'MA' in data.columns else None,
        'rsi_14': float(data['RSI'].iloc[-1]) if 'RSI' in data.columns else None,
    }
    return stats


# ============== API Endpoints ==============
@app.get("/")
async def serve_ui():
    return FileResponse("frontend/build/index.html")



@app.get("/compare", response_model=ComparisonResponse)
async def compare_stocks(symbols: str, start: str, end: str):
    """
    Compare multiple stock prices
    
    Parameters:
    - symbols: Comma-separated stock symbols (e.g., "RELIANCE.NS,AAPL")
    - start: Start date (YYYY-MM-DD)
    - end: End date (YYYY-MM-DD)
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(',') if s.strip()]
        
        if not symbol_list:
            raise HTTPException(status_code=400, detail="No symbols provided")
        
        prices_data = {}
        all_dates = None
        
        # Fetch data for each symbol
        for symbol in symbol_list:
            data = fetch_stock_data(symbol, start, end)
            data.index = pd.to_datetime(data.index)
            prices_data[symbol] = data['Close'].values.tolist()
            
            if all_dates is None:
                all_dates = data.index
        
        # Format dates
        dates = [d.strftime("%Y-%m-%d") for d in all_dates]
        
        return ComparisonResponse(
            symbols=symbol_list,
            dates=dates,
            prices=prices_data,
            start_date=start,
            end_date=end
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error comparing stocks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/predict", response_model=PredictionResponse)
async def predict_stock(symbol: str, start: str, end: str, days: int = 7):
    """
    Predict stock price using LSTM
    
    Parameters:
    - symbol: Stock symbol (e.g., "RELIANCE.NS")
    - start: Start date (YYYY-MM-DD)
    - end: End date (YYYY-MM-DD)
    - days: Number of days to predict (default: 7)
    """
    try:
        # Sanitize symbol
        symbol = symbol.strip().upper()
        
        if days < 1 or days > 30:
            raise HTTPException(status_code=400, detail="Days must be between 1 and 30")
        
        # Fetch data
        data = fetch_stock_data(symbol, start, end)
        data = data.copy()
        
        # Add indicators
        data = moving_average(data)
        data = calculate_rsi(data)
        
        # Prepare LSTM data
        window = 60
        X, y, scaler = prepare_data(data, window)
        
        if len(X) < 10:
            raise HTTPException(status_code=400, detail="Not enough data to train model")
        
        # Split data
        X_train, y_train = X[:-days], y[:-days]
        X_test = X[-days:]
        
        # Build and train model
        model = build_lstm((X.shape[1], 1))
        model.fit(X_train, y_train, epochs=5, batch_size=32, verbose=0)
        
        # Make predictions
        predicted_scaled = model.predict(X_test, verbose=0)
        predicted = scaler.inverse_transform(predicted_scaled)
        actual_scaled = y[-days:]
        actual = scaler.inverse_transform(actual_scaled.reshape(-1, 1))
        
        # Calculate RMSE
        rmse = float(np.sqrt(mean_squared_error(actual, predicted)))
        
        # Generate future dates
        last_date = data.index[-1]
        future_dates = generate_future_dates(last_date, days)
        future_dates_str = [d.strftime("%Y-%m-%d") for d in future_dates]
        
        # Prepare response
        dates_str = [d.strftime("%Y-%m-%d") for d in data.index]
        
        return PredictionResponse(
            symbol=symbol,
            predictions=predicted.flatten().tolist(),
            actual=actual.flatten().tolist(),
            future_dates=future_dates_str,
            rmse=rmse,
            latest_close=float(data['Close'].iloc[-1]),
            ma=data['MA'].fillna(0).tolist(),
            rsi=data['RSI'].fillna(0).tolist(),
            dates=dates_str
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error predicting stock {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats", response_model=StatsResponse)
async def get_stats(symbol: str, start: str, end: str):
    """
    Get key statistics for a stock
    
    Parameters:
    - symbol: Stock symbol (e.g., "RELIANCE.NS")
    - start: Start date (YYYY-MM-DD)
    - end: End date (YYYY-MM-DD)
    """
    try:
        # Sanitize symbol
        symbol = symbol.strip().upper()
        
        data = fetch_stock_data(symbol, start, end)
        data = moving_average(data)
        data = calculate_rsi(data)
        
        stats = calculate_stats(data)
        
        return StatsResponse(
            symbol=symbol,
            **stats
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting stats for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download_predictions_csv")
async def download_predictions_csv(symbol: str, days: int = 7, start: str = "2020-01-01"):
    """
    Download predictions as CSV file
    
    Parameters:
    - symbol: Stock symbol (e.g., "RELIANCE.NS")
    - days: Number of days to predict (default: 7)
    - start: Start date for historical data (default: 2020-01-01)
    """
    try:
        # Sanitize symbol
        symbol = symbol.strip().upper()
        
        if days < 1 or days > 30:
            raise HTTPException(status_code=400, detail="Days must be between 1 and 30")
        
        # Use current date as end date for predictions
        end = datetime.now().strftime("%Y-%m-%d")
        
        # Fetch data
        data = fetch_stock_data(symbol, start, end)
        data = data.copy()
        
        # Add indicators
        data = moving_average(data)
        data = calculate_rsi(data)
        
        # Prepare LSTM data
        window = 60
        X, y, scaler = prepare_data(data, window)
        
        if len(X) < 10:
            raise HTTPException(status_code=400, detail="Not enough data to train model")
        
        # Split data
        X_train, y_train = X[:-days], y[:-days]
        X_test = X[-days:]
        
        # Build and train model
        model = build_lstm((X.shape[1], 1))
        model.fit(X_train, y_train, epochs=5, batch_size=32, verbose=0)
        
        # Make predictions
        predicted_scaled = model.predict(X_test, verbose=0)
        predicted = scaler.inverse_transform(predicted_scaled)
        
        # Generate future dates
        last_date = data.index[-1]
        future_dates = generate_future_dates(last_date, days)
        
        # Create CSV data
        csv_data = pd.DataFrame({
            "date": [d.strftime("%Y-%m-%d") for d in future_dates],
            "predicted_price": predicted.flatten()
        })
        
        # Convert to CSV string in memory
        csv_buffer = io.StringIO()
        csv_data.to_csv(csv_buffer, index=False)
        csv_content = csv_buffer.getvalue()
        
        # Create file name (symbol in uppercase)
        filename = f"{symbol.upper()}_predictions.csv"
        
        # Return as file download
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading predictions for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
