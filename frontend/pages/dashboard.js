import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    fetch(base + '/offers')
      .then(r => r.json())
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>⚡ Marketplace</h1>
      {offers.length === 0 ? <p>No offers yet.</p> : (
        <ul>
          {offers.map(o => (
            <li key={o.id}>{o.seller} — {o.remainingKWh}/{o.amountKWh} kWh — ${o.pricePerKWh}/kWh</li>
          ))}
        </ul>
      )}
    </div>
  );
}
