import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { stockAPI } from '../api';

export default function DownloadCSVButton({ symbol, days, loading }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!symbol || !days) {
      alert('Please select a stock and prediction days.');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await stockAPI.downloadPredictionsCSV(symbol, days);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${symbol.toUpperCase()}_predictions.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download CSV: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || isDownloading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
    >
      <Download size={18} />
      {isDownloading ? 'Downloading...' : 'Download CSV'}
    </button>
  );
}
