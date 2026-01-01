from datetime import datetime
import yfinance as yf
import pandas as pd
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

def fetch_stock_data(symbol: str, start_date: str, end_date: str):
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        end_date = min(end_date, today)

        data = yf.download(
            symbol,
            start=start_date,
            end=end_date,
            progress=False
        )

        if data.empty:
            raise ValueError(f"No data for {symbol}")

        return data

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=str(e))
