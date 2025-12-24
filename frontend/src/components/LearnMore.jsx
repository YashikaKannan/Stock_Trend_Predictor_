import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function LearnMore({ onClose, onTry }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-2xl w-full mx-4 bg-panel p-6 rounded-lg shadow-2xl z-10">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded hover:bg-white/5"
        >
          <X size={18} />
        </button>

        <h3 className="text-2xl font-bold mb-3 text-primary">How the AI Works</h3>
        <p className="text-muted mb-4">Our LSTM deep learning models learn from historical market data and common technical indicators (MA, RSI) to identify patterns that often precede price moves.</p>

        <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
          <li>
            <strong>Model foundation:</strong> LSTM-based networks trained on years of historical NSE data and enriched with technical indicators to capture time-dependent patterns.
          </li>
          <li>
            <strong>What you get:</strong> One-click predictions with interactive charts comparing historical and predicted prices, concise metrics (predicted price, RSI, MA, accuracy) and downloadable CSVs for offline analysis.
          </li>
          <li>
            <strong>Why trust it:</strong> Models are validated on held-out historical data and surface simple accuracy measures and indicators so you can assess reliability quickly.
          </li>
        </ul>

        <p className="text-xs text-muted italic mb-4">For educational purposes only — not financial or investment advice. Use predictions as one input among others and confirm decisions with your own research or a licensed professional.</p>

        <div className="flex gap-3">
          <button
            onClick={() => { if (onTry) onTry(); }}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold"
          >
            Try Now
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
