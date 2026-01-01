import os
import requests
import pandas as pd
from fastapi import HTTPException
from dotenv import load_dotenv
import os

load_dotenv()  
API_KEY = os.getenv("TWELVE_DATA_API_KEY")

def fetch_stock_data_twelve(symbol: str, start: str, end: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Twelve Data API key missing")

    url = "https://api.twelvedata.com/time_series"
    params = {
        "symbol": symbol,
        "interval": "1day",
        "start_date": start,
        "end_date": end,
        "apikey": API_KEY,
        "format": "JSON",
        "outputsize": 5000
    }

    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    if "values" not in data:
        raise HTTPException(
            status_code=400,
            detail=f"Twelve Data error for {symbol}: {data.get('message', 'No data')}"
        )

    df = pd.DataFrame(data["values"])
    df["datetime"] = pd.to_datetime(df["datetime"])
    df = df.sort_values("datetime")
    df.set_index("datetime", inplace=True)

    df = df.astype(float)
    df.rename(columns={
        "open": "Open",
        "high": "High",
        "low": "Low",
        "close": "Close",
        "volume": "Volume"
    }, inplace=True)

    return df
