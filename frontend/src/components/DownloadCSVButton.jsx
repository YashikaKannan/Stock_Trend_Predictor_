import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { stockAPI } from '../api';
import { formatINR } from '../utils/currency';

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
      
      // Convert the blob to text and format any price columns as INR
      const blob = response.data;
      const text = await blob.text();
      const lines = text.split('\n').filter(Boolean);
      if (lines.length > 0) {
        const headers = lines[0].split(',');
        // find a price-like column
        const priceIdx = headers.findIndex(h => /price/i.test(h));

        if (priceIdx !== -1) {
          const out = [headers.join(',')];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (!cols || cols.length <= priceIdx) {
              out.push(lines[i]);
              continue;
            }
            const raw = cols[priceIdx];
            const num = Number(raw);
            cols[priceIdx] = isFinite(num) ? formatINR(num) : raw;
            out.push(cols.join(','));
          }

          const newCsv = out.join('\n');
          const newBlob = new Blob([newCsv], { type: 'text/csv' });
          const url = window.URL.createObjectURL(newBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${symbol.toUpperCase()}_predictions.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          // fallback: download original blob
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${symbol.toUpperCase()}_predictions.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      } else {
        // empty CSV fallback
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${symbol.toUpperCase()}_predictions.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
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
