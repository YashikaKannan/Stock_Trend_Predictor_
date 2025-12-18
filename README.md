# Stock Trend Predictor 📈

A full-stack web application for stock price prediction using LSTM deep learning. This project converts a Streamlit app into a modern FastAPI backend + React frontend architecture with **real-time Yahoo Finance data fetching**.

---

## 🎯 Features

✅ **Live Data Fetching** - Real-time stock data from Yahoo Finance  
✅ **LSTM Predictions** - Deep learning model for accurate price forecasting  
✅ **Technical Indicators** - Moving Average (MA) and RSI calculations  
✅ **Multi-Stock Comparison** - Compare multiple stocks side-by-side  
✅ **Beautiful Dashboard** - Modern React UI with Tailwind CSS & Recharts  
✅ **RESTful API** - FastAPI backend with comprehensive endpoints  
✅ **Docker Support** - Easy deployment with Docker & Docker Compose  
✅ **Zero Database** - All data is fetched on-demand (no persistence needed)  

---


## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)

### Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
Backend runs at `http://localhost:8000`

#### 2. Frontend Setup (in another terminal)
```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## 🐳 Docker Deployment

### Option 1: Single Docker Build (Backend + Frontend)
```bash
docker build -t stock-predictor .
docker run -p 8000:8000 stock-predictor
```
Access the app at `http://localhost:8000`

### Option 2: Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

---

## 📡 API Endpoints

### 1. **Compare Stocks**
```http
GET /compare?symbols=RELIANCE.NS,AAPL&start=2020-01-01&end=2025-11-13
```
**Response:**
```json
{
  "symbols": ["RELIANCE.NS", "AAPL"],
  "dates": ["2020-01-01", "2020-01-02", ...],
  "prices": {
    "RELIANCE.NS": [1234.5, 1245.2, ...],
    "AAPL": [75.5, 76.2, ...]
  },
  "start_date": "2020-01-01",
  "end_date": "2025-11-13"
}
```

### 2. **Predict Stock Price**
```http
GET /predict?symbol=RELIANCE.NS&start=2020-01-01&end=2025-11-13&days=7
```
**Response:**
```json
{
  "symbol": "RELIANCE.NS",
  "predictions": [1500.5, 1510.2, 1505.8, ...],
  "actual": [1480.1, 1490.5, 1485.2, ...],
  "future_dates": ["2025-11-14", "2025-11-15", ...],
  "rmse": 23.45,
  "latest_close": 1495.5,
  "ma": [1400.1, 1410.5, ...],
  "rsi": [65.2, 62.8, ...],
  "dates": ["2020-01-01", "2020-01-02", ...]
}
```

### 3. **Get Stock Statistics**
```http
GET /stats?symbol=RELIANCE.NS&start=2020-01-01&end=2025-11-13
```
**Response:**
```json
{
  "symbol": "RELIANCE.NS",
  "open_price": 1490.0,
  "prev_close": 1485.5,
  "high_52w": 1850.0,
  "low_52w": 1200.0,
  "volume": 1234567.0,
  "latest_close": 1495.5,
  "ma_20": 1420.3,
  "rsi_14": 65.2
}
```

---

## 🧠 Machine Learning Details

### LSTM Architecture
```
Input Layer (60 steps, 1 feature)
    ↓
LSTM Layer 1 (50 units, return sequences)
    ↓
LSTM Layer 2 (50 units)
    ↓
Dense Layer (1 output)
    ↓
Output (Next price prediction)
```

### Data Preparation
- **Window Size**: 60 days of historical data
- **Normalization**: MinMaxScaler (0-1 range)
- **Training**: 80% of data (excluding prediction days)
- **Testing**: Last N days for validation

### Technical Indicators
- **Moving Average (MA)**: 20-day window
- **RSI (Relative Strength Index)**: 14-day window

---

## 🎨 Frontend Features

- **Responsive Dashboard** - Works on desktop, tablet, mobile
- **Interactive Charts** - Recharts for smooth visualizations
- **Real-time Updates** - Fetch latest data with one click
- **Dark Theme** - Eye-friendly design powered by Tailwind CSS
- **Stock Comparison** - Multiple stocks in one chart
- **Statistics Panel** - Key metrics at a glance

---

## 📊 Stock Symbol Examples

### Indian Stocks (NSE)
- `RELIANCE.NS` - Reliance Industries
- `TCS.NS` - Tata Consultancy Services
- `INFY.NS` - Infosys
- `WIPRO.NS` - Wipro

### US Stocks (NASDAQ/NYSE)
- `AAPL` - Apple
- `MSFT` - Microsoft
- `GOOGL` - Google
- `TSLA` - Tesla
- `AMZN` - Amazon

---

## 🔧 Configuration

### Backend Environment Variables
```bash
PYTHONUNBUFFERED=1  # Python stdout flushing
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=http://localhost:8000  # Backend API URL
```

---

## 📝 Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `yfinance` - Yahoo Finance data
- `tensorflow` - Deep learning
- `scikit-learn` - ML utilities

### Frontend
- `react` - UI framework
- `axios` - HTTP client
- `recharts` - Data visualization
- `tailwindcss` - CSS framework
- `lucide-react` - Icons

---

## ⚠️ Important Notes

1. **Real-time Data**: All data is fetched from Yahoo Finance in real-time. No database required.
2. **Model Training**: LSTM trains on-demand for each prediction (5 epochs).
3. **Processing Time**: Predictions may take 30-60 seconds depending on data size.
4. **RMSE Metric**: Lower RMSE indicates better model performance.
5. **Weekdays Only**: Predictions only generate for trading days (Mon-Fri).

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Must be 3.9+

# Check if port 8000 is available
netstat -tuln | grep 8000  # Linux/macOS
netstat -ano | findstr 8000  # Windows
```

### Frontend API errors
```bash
# Ensure backend is running
curl http://localhost:8000

# Check CORS configuration
# CORS is enabled for all origins in main.py
```

### Data fetch failures
```bash
# Check internet connection
# Verify stock symbols (e.g., RELIANCE.NS, not RELIANCE)
# Check date range (must have historical data available)
```

---

## 📈 Performance Optimization

- **Data Caching**: Frontend caches API responses
- **Lazy Loading**: Charts load only when needed
- **Efficient Prediction**: Batch processing in LSTM
- **Responsive Design**: Mobile-first approach

---

## 🤝 Contributing

This is a demonstration project. Feel free to fork, modify, and deploy!

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

Created by **Yashika** with ❤️

- 🔗 LinkedIn: https://linkedin.com/in/yashika-kannan
- 📧 Email: Contact via LinkedIn

---

## 🙏 Acknowledgments

- **LSTM Architecture**: Inspired by financial forecasting best practices
- **Data Source**: Yahoo Finance via yfinance
- **UI Framework**: React + Tailwind CSS
- **Charting**: Recharts library
- **API**: FastAPI framework

---

**Happy Trading! 📊✨**
