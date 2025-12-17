import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PredictionChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartData = useMemo(() => {
    if (!data || !data.dates) return [];

    // Combine historical data with future predictions
    const combined = [];
    
    // Add historical data
    data.dates.forEach((date, idx) => {
      combined.push({
        date: new Date(date).toLocaleDateString(),
        actual: data.ma[idx] ? parseFloat(data.ma[idx]) : null,
        rsi: data.rsi[idx] ? parseFloat(data.rsi[idx]) : null,
        type: 'historical',
      });
    });

    // Add predictions
    if (data.future_dates && data.predictions) {
      data.future_dates.forEach((date, idx) => {
        combined.push({
          date: new Date(date).toLocaleDateString(),
          predicted: parseFloat(data.predictions[idx]),
          type: 'prediction',
        });
      });
    }

    return combined;
  }, [data]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">📈 Closing Price Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
            <XAxis
              dataKey="date"
              tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 11 }}
              interval={Math.floor(chartData.length / 8)}
            />
            <YAxis yAxisId="left" tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: `1px solid ${isDark ? '#0891b2' : '#2563eb'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: isDark ? '#00BFFF' : '#2563eb' }}
              itemStyle={{ color: isDark ? '#cbd5e1' : '#111' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', color: isDark ? '#cbd5e1' : 'var(--text-color)' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="actual"
              stroke={isDark ? '#00BFFF' : '#0369a1'}
              dot={false}
              strokeWidth={2}
              name="Historical MA"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="predicted"
              stroke={isDark ? '#FF6B6B' : '#ff4d4f'}
              dot={false}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Price"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-primary mb-3">📊 RSI (Relative Strength Index)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
            <XAxis
              dataKey="date"
              tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 11 }}
              interval={Math.floor(chartData.length / 8)}
            />
            <YAxis yAxisId="right" tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: `1px solid ${isDark ? '#0891b2' : '#2563eb'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: isDark ? '#00BFFF' : '#2563eb' }}
            />
            <Bar
              yAxisId="right"
              dataKey="rsi"
              fill={isDark ? '#4ECDC4' : '#18a7a2'}
              name="RSI (14)"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
