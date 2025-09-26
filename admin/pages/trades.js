import { useEffect, useState } from 'react';

export default function Trades() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    fetch(base + '/admin/trades')
      .then(r => r.json())
      .then(setTrades)
      .catch(() => setTrades([]));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Admin – Trades</h1>
      <ul>
        {trades.map(t => <li key={t.id}>{t.buyer} bought {t.kWh} kWh from {t.seller} — ${t.grossAmount}</li>)}
      </ul>
    </div>
  );
}
