import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ComparisonChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartData = useMemo(() => {
    if (!data || !data.dates || !data.prices) return [];
    
    return data.dates.map((date, idx) => {
      const point = { date: new Date(date).toLocaleDateString() };
      data.symbols.forEach(symbol => {
        if (data.prices[symbol] && data.prices[symbol][idx] !== undefined) {
          point[symbol] = parseFloat(data.prices[symbol][idx]);
        }
      });
      return point;
    });
  }, [data]);

  const colors = ['#00BFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
        <XAxis
          dataKey="date"
          tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }}
          interval={Math.floor(chartData.length / 6)}
        />
        <YAxis tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} />
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
        {data.symbols.map((symbol, idx) => (
          <Line
            key={symbol}
            type="monotone"
            dataKey={symbol}
            stroke={colors[idx % colors.length]}
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
