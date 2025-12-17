#!/usr/bin/env python3
"""
Stock Trend Predictor - Example API Usage

This script demonstrates how to use the Stock Trend Predictor API.
Run the backend first: python backend/main.py
Then run this script to see the API in action.

Requirements: pip install requests
"""

import requests
import json
from datetime import datetime, timedelta

# API Configuration
API_BASE_URL = "http://localhost:8000"

# Example stocks
SYMBOLS = ["RELIANCE.NS", "AAPL", "MSFT"]
START_DATE = "2020-01-01"
END_DATE = datetime.now().strftime("%Y-%m-%d")
PREDICTION_DAYS = 7


def print_response(title, data):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"📊 {title}")
    print(f"{'='*60}")
    print(json.dumps(data, indent=2))


def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{API_BASE_URL}/")
        print_response("Health Check", response.json())
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


def test_compare_stocks():
    """Compare multiple stocks"""
    try:
        symbols_str = ",".join(SYMBOLS[:2])  # Compare first 2 stocks
        params = {
            "symbols": symbols_str,
            "start": START_DATE,
            "end": END_DATE
        }
        response = requests.get(f"{API_BASE_URL}/compare", params=params)
        response.raise_for_status()
        
        data = response.json()
        print_response(f"Compare {symbols_str}", {
            "symbols": data["symbols"],
            "date_range": f"{data['start_date']} to {data['end_date']}",
            "num_dates": len(data["dates"]),
            "first_date": data["dates"][0] if data["dates"] else None,
            "last_date": data["dates"][-1] if data["dates"] else None,
            "prices_sample": {k: v[:3] for k, v in data["prices"].items()}
        })
        return True
    except Exception as e:
        print(f"❌ Compare stocks failed: {e}")
        return False


def test_predict_stock():
    """Predict stock price using LSTM"""
    try:
        symbol = SYMBOLS[0]  # Use first stock
        params = {
            "symbol": symbol,
            "start": START_DATE,
            "end": END_DATE,
            "days": PREDICTION_DAYS
        }
        response = requests.get(f"{API_BASE_URL}/predict", params=params, timeout=120)
        response.raise_for_status()
        
        data = response.json()
        print_response(f"Predict {symbol}", {
            "symbol": data["symbol"],
            "prediction_days": len(data["future_dates"]),
            "future_dates": data["future_dates"],
            "rmse": data["rmse"],
            "latest_close": data["latest_close"],
            "latest_ma": data["ma"][-1] if data["ma"] else None,
            "latest_rsi": data["rsi"][-1] if data["rsi"] else None,
            "predictions_sample": data["predictions"][:3],
            "actual_sample": data["actual"][:3]
        })
        return True
    except requests.exceptions.Timeout:
        print(f"⏳ Prediction timeout - LSTM training takes 30-60 seconds...")
        return False
    except Exception as e:
        print(f"❌ Predict stock failed: {e}")
        return False


def test_get_stats():
    """Get stock statistics"""
    try:
        symbol = SYMBOLS[0]
        params = {
            "symbol": symbol,
            "start": START_DATE,
            "end": END_DATE
        }
        response = requests.get(f"{API_BASE_URL}/stats", params=params)
        response.raise_for_status()
        
        data = response.json()
        print_response(f"Statistics for {symbol}", data)
        return True
    except Exception as e:
        print(f"❌ Get stats failed: {e}")
        return False


def main():
    """Run all API tests"""
    print("""
╔════════════════════════════════════════════════════════════╗
║     Stock Trend Predictor - API Examples                  ║
╚════════════════════════════════════════════════════════════╝

🚀 This script demonstrates all API endpoints

Make sure the backend is running:
  python backend/main.py

Then run this script to see real responses!
    """)
    
    print("\n⏳ Testing API endpoints...")
    
    # Run tests
    tests = [
        ("Health Check", test_health_check),
        ("Compare Stocks", test_compare_stocks),
        ("Get Statistics", test_get_stats),
        ("Predict Stock (may take 30-60 seconds)", test_predict_stock),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n▶️  Running: {test_name}...")
        success = test_func()
        results.append((test_name, success))
    
    # Print summary
    print(f"\n{'='*60}")
    print("📋 Test Summary")
    print(f"{'='*60}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASSED" if success else "⚠️  SKIPPED/FAILED"
        print(f"  {status}: {test_name}")
    
    print(f"\n{passed}/{total} tests completed")
    
    if passed == total:
        print("\n🎉 All tests passed! API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check backend logs for details.")
    
    print(f"\n{'='*60}")
    print("📚 Next Steps:")
    print(f"{'='*60}")
    print("1. Frontend Dashboard: http://localhost:3000")
    print("2. Interactive API Docs: http://localhost:8000/docs")
    print("3. Read QUICKSTART.md for more information")
    print("4. Check README.md for full documentation")


if __name__ == "__main__":
    main()
