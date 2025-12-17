import React from 'react';

export default function StatsCard({ label, value }) {
  return (
    <div className="panel p-4 hover:border-cyan-500/50 transition-colors">
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-lg font-bold" style={{ color: 'var(--accent-cyan)' }}>{value}</p>
    </div>
  );
}
