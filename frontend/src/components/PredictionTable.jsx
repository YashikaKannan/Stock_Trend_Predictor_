import React from 'react';

export default function PredictionTable({ data }) {
  // If there's no data, show an empty state message
  if (!data || !data.future_dates || !data.predictions || data.future_dates.length === 0) {
    return (
      <div className="mt-4 panel p-4 text-center" role="status">
        <p className="text-muted">No predictions yet — run a prediction to see results</p>
      </div>
    );
  }

  const rows = [];
  const len = Math.min(data.future_dates.length, data.predictions.length);
  for (let i = 0; i < len; i++) {
    rows.push({
      date: new Date(data.future_dates[i]).toLocaleDateString(),
      price: parseFloat(data.predictions[i])
    });
  }

  return (
    <div className="mt-4 panel panel-contrast overflow-auto p-3" aria-live="polite">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-primary">Predicted Prices</h4>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm md:text-base table-fixed border-collapse" role="table" aria-label="Predicted prices table">
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 text-left px-3 py-1 text-primary font-bold" style={{ borderBottom: '1px solid var(--panel-border-color)', background: 'var(--panel-bg-contrast)' }}>Date</th>
              <th scope="col" className="sticky top-0 text-right px-5 py-5 text-primary font-bold" style={{ borderBottom: '1px solid var(--panel-border-color)', background: 'var(--panel-bg-contrast)' }}>Predicted Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="odd:bg-transparent even:bg-transparent" style={{ borderTop: idx > 0 ? '1px solid var(--panel-border-color)' : 'none' }}>
                <td className="px-3 py-1 text-primary">{r.date}</td>
                <td className="px-3 py-1 text-right text-primary">${r.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
