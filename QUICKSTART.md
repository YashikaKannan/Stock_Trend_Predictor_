# Quick Start Guide

## 🚀 Running Locally

### Option 1: Fast Development Setup (Separate Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

Then open http://localhost:3000

---

### Option 2: Docker Compose (Recommended for Testing)

```bash
# Build and run everything
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## 🧪 Testing the API

### Using cURL:

**Compare stocks:**
```bash
curl "http://localhost:8000/compare?symbols=RELIANCE.NS,AAPL&start=2020-01-01&end=2025-11-13"
```

**Predict stock price:**
```bash
curl "http://localhost:8000/predict?symbol=RELIANCE.NS&start=2020-01-01&end=2025-11-13&days=7"
```

**Get statistics:**
```bash
curl "http://localhost:8000/stats?symbol=RELIANCE.NS&start=2020-01-01&end=2025-11-13"
```

---

## 📊 Using the Dashboard

1. Enter stock symbols (comma-separated)
2. Set date range
3. Click "📊 Compare Stocks"
4. Click "🧠 Predict Stock" for each symbol
5. View predictions and statistics

---

## 🐛 Debugging

**Backend issues?**
```bash
# Check if service is running
curl http://localhost:8000

# View logs (in Docker Compose)
docker-compose logs backend
```

**Frontend issues?**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check if backend is reachable
curl http://localhost:8000/predict?symbol=AAPL&start=2020-01-01&end=2025-11-13&days=7
```

---

## 🎯 Common Tasks

### Add New Stock Indicator

1. Add calculation in `backend/indicators.py`
2. Add field to `PredictionResponse` in `backend/main.py`
3. Display in frontend component

### Change Prediction Parameters

Edit `backend/main.py`:
- Change LSTM units
- Modify training epochs
- Adjust window size

### Customize UI

Edit `frontend/src/components/` files:
- Modify colors in `Header.jsx`
- Change chart settings in `ComparisonChart.jsx`
- Update responsive breakpoints using Tailwind

---

Enjoy! 🚀📈
