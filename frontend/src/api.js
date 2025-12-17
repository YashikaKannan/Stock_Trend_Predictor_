import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

export const stockAPI = {
  compareStocks: (symbols, start, end) => {
    return apiClient.get('/compare', {
      params: {
        symbols: symbols.join(','),
        start,
        end,
      },
    });
  },

  predictStock: (symbol, start, end, days) => {
    return apiClient.get('/predict', {
      params: {
        symbol,
        start,
        end,
        days,
      },
    });
  },

  getStats: (symbol, start, end) => {
    return apiClient.get('/stats', {
      params: {
        symbol,
        start,
        end,
      },
    });
  },

  downloadPredictionsCSV: (symbol, days) => {
    return apiClient.get('/download_predictions_csv', {
      params: {
        symbol,
        days,
      },
      responseType: 'blob',
    });
  },
};

export default apiClient;
