import React from 'react';
import { Settings } from 'lucide-react';

export default function Sidebar({
  symbols,
  setSymbols,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  predictionDays,
  setPredictionDays,
  onCompare,
  loading,
}) {
  const handleAddSymbol = () => {
    setSymbols([...symbols, '']);
  };

  const handleRemoveSymbol = (index) => {
    setSymbols(symbols.filter((_, i) => i !== index));
  };

  const handleSymbolChange = (index, value) => {
    const newSymbols = [...symbols];
    newSymbols[index] = value.toUpperCase();
    setSymbols(newSymbols);
  };

  return (
    <aside className="w-full lg:w-80 panel backdrop-blur p-6 h-fit sticky top-6">
      <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <Settings size={20} />
        Settings
      </h2>

      {/* Stock Symbols */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-primary mb-2">
          Stock Symbols
        </label>
        <p className="text-xs text-muted mb-3">
          📌 For Indian stocks, add '.NS' (e.g., RELIANCE.NS)
        </p>
        <div className="space-y-2">
          {symbols.map((symbol, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={symbol}
                onChange={(e) => handleSymbolChange(idx, e.target.value)}
                placeholder="e.g., RELIANCE.NS"
                className="flex-1 text-sm placeholder-gray-500 focus:outline-none input-panel"
                style={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border-color)' }}
              />
              {symbols.length > 1 && (
                <button
                  onClick={() => handleRemoveSymbol(idx)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleAddSymbol}
          className="mt-2 w-full px-3 py-2 btn-ghost text-cyan-400 rounded text-sm transition-colors"
          style={{ borderColor: 'var(--panel-border-color)' }}
        >
          + Add Symbol
        </button>
      </div>

      {/* Date Range */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm focus:outline-none input-panel"
            style={{ borderColor: 'var(--panel-border-color)' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-sm focus:outline-none input-panel"
            style={{ borderColor: 'var(--panel-border-color)' }}
          />
        </div>
      </div>

      {/* Prediction Days */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-primary mb-2">
          Days to Predict: {predictionDays}
        </label>
        <input
          type="range"
          min="5"
          max="30"
          value={predictionDays}
          onChange={(e) => setPredictionDays(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-muted mt-1">
          Range: 5 to 30 days
        </p>
      </div>

      {/* Compare Button */}
      <button
        onClick={onCompare}
        disabled={loading || symbols.some(s => !s)}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
      >
        {loading ? '⏳ Loading...' : '📊 Compare Stocks'}
      </button>
    </aside>
  );
}
