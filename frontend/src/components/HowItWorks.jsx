import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { formatINR } from '../utils/currency';

export default function HowItWorks({ onTry }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Steps */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary">How it works</h2>
          <p className="text-muted mb-6">Three simple steps to get AI-driven trend predictions for NSE stocks — fast, clear, and actionable.</p>

          <ol className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="flex-none w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">1</div>
              <div>
                <h3 className="font-medium">Select a Stock</h3>
                <p className="text-sm text-slate-600">Search NSE tickers or names and add them to your watchlist — no setup required.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="flex-none w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">2</div>
              <div>
                <h3 className="font-medium">Run AI Prediction</h3>
                <p className="text-sm text-slate-600">One‑click LSTM & ML ensemble predictions with explainable indicators and fast inference.</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="flex-none w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">3</div>
              <div>
                <h3 className="font-medium">View Results</h3>
                <p className="text-sm text-slate-600">Interactive charts, predicted prices, RSI, MA, and model accuracy — exportable for further analysis.</p>
              </div>
            </li>
          </ol>

        </div>

        {/* Right: Mini dashboard preview */}
        <div className="bg-white/5 panel rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-2">Your Personal AI Trend Prediction Tool</h4>
          <p className="text-sm text-slate-400 mb-4">Clean, intuitive dashboard with charts and technical indicators for modern investors.</p>

          <div className="h-36 rounded-md mb-4">
            {/* Mini sparkline chart */}
            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{x:1,y:1180},{x:2,y:1192},{x:3,y:1175},{x:4,y:1210},{x:5,y:1202},{x:6,y:1235},{x:7,y:1220},{x:8,y:1240},{x:9,y:1230},{x:10,y:1250}]}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <Tooltip formatter={(value) => formatINR(value)} wrapperStyle={{ borderRadius: 8 }} />
                  <Line type="monotone" dataKey="y" stroke={isDark ? '#06b6d4' : '#2563eb'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-3 text-sm">
            <li className="p-2 bg-slate-50/5 rounded">Predicted Price<br/><span className="font-medium">{formatINR(1235)}</span></li>
            <li className="p-2 bg-slate-50/5 rounded">RSI<br/><span className="font-medium">62</span></li>
            <li className="p-2 bg-slate-50/5 rounded">MA (20/50)<br/><span className="font-medium">Bullish</span></li>
            <li className="p-2 bg-slate-50/5 rounded">Model Accuracy<br/><span className="font-medium">87%</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
