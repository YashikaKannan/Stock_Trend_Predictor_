import React from 'react';
import { Activity, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ onBackHome }) {
  return (
    <header style={{ background: 'var(--bg-gradient)' }} className="border-b border-cyan-500/30 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Top row with home button positioned absolutely */}
        <div className="relative mb-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="text-cyan-400" size={28} />
            <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Stock Trend Predictor
            </h1>
          </div>
          {onBackHome && (
            <div className="absolute right-0 top-0 flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={onBackHome}
                className="flex items-center gap-2 px-4 py-2 btn-ghost hover:bg-opacity-90 text-muted hover:text-cyan-200 rounded-lg transition-colors text-sm md:text-base"
                style={{ borderColor: 'var(--panel-border-color)' }}
              >
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>
          )}
        </div>

        {/* Center section with description and feature cards */}
        <div className="flex flex-col items-center justify-center text-center">
        <p className="text-muted text-center mb-4">
          Live Forecasting Dashboard Powered by LSTM Deep Learning
        </p>
        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 md:p-5 w-full h-full">
            <p className="text-sm md:text-base text-cyan-300 font-semibold">📅 Fetch Live Data</p>
            <p className="text-sm md:text-base text-muted">From Yahoo Finance</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 md:p-5 w-full h-full">
            <p className="text-sm md:text-base text-purple-300 font-semibold">🧠 Predict Trends</p>
            <p className="text-sm md:text-base text-muted">Using LSTM Deep Learning</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 md:p-5 w-full h-full">
            <p className="text-sm md:text-base text-green-300 font-semibold">📉 Visualize Insights</p>
            <p className="text-sm md:text-base text-muted">With MA, RSI, RMSE</p>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
