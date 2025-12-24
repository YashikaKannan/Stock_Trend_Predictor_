import React, { useState } from 'react';
import { TrendingUp, Zap, Eye, ArrowRight, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import HowItWorks from './HowItWorks';
import LearnMore from './LearnMore';

export default function LandingPage({ onExplore }) {
  const [learnOpen, setLearnOpen] = useState(false);

  return (
    <div style={{ background: 'var(--bg-gradient)', color: 'var(--text-color)' }} className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur" style={{ background: 'var(--bg-gradient)', borderBottom: '1px solid var(--panel-border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} className="text-cyan-400" />
            <span className="text-lg font-bold">Stock Trend Predictor</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onExplore}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50"
            >
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
          {/* Subtle background element */}
          <div className="absolute inset-0 opacity-30">
            <svg viewBox="0 0 1200 600" className="w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <polyline
                points="0,400 150,350 300,370 450,300 600,320 750,250 900,280 1050,200 1200,230"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* <div className="inline-block px-4 py-2 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              ✨ Powered by Deep Learning
            </div> */}

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent text-primary">
              Predict Stock Trends with AI
            </h1>

            <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Harness the power of LSTM deep learning to forecast stock price movements in real-time. Get accurate trend predictions to make informed investment decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onExplore}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
              >
                Explore Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setLearnOpen(true)}
                className="px-8 py-4 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-semibold rounded-lg transition-all duration-300 backdrop-blur bg-cyan-500/5 hover:bg-cyan-500/10"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal (Hero) */}
      {learnOpen && (
        <LearnMore
          onClose={() => setLearnOpen(false)}
          onTry={() => { setLearnOpen(false); onExplore(); }}
        />
      )}

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-6 backdrop-blur" style={{ background: 'transparent' }}>
          <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary">
            Why Choose Stock Trend Predictor?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative panel p-8 border hover:border-cyan-500/30 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Accurate AI Forecasts
                </h3>
                <p className="text-muted">
                  Advanced LSTM neural networks trained on historical data deliver precise trend predictions with real-time accuracy.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative panel p-8 border hover:border-cyan-500/30 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Real-Time Tracking
                </h3>
                <p className="text-muted">
                  Monitor multiple stocks simultaneously with live data updates. Get instant insights as market conditions change.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative panel p-8 border hover:border-cyan-500/30 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Visual Insights
                </h3>
                <p className="text-muted">
                  Beautiful, intuitive charts and metrics make complex financial data easy to understand at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks onTry={onExplore} />

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Ready to forecast stock trends?
          </h2>
          <p className="text-muted text-lg mb-8">
            Start making data-driven investment decisions powered by advanced AI.
          </p>
          <button
            onClick={onExplore}
            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2 mx-auto"
          >
            Explore Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 md:px-6 panel backdrop-blur">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted text-sm">
            © 2025 Stock Trend Predictor · Built by Yashika
          </p>
        </div>
      </footer>
    </div>
  );
}
