import { useEffect, useState } from 'react';

export default function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    fetch(base + '/admin/offers')
      .then(r => r.json())
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Admin – Offers</h1>
      <ul>
        {offers.map(o => <li key={o.id}>{o.seller} — {o.amountKWh} kWh — remaining {o.remainingKWh}</li>)}
      </ul>
    </div>
  );
}
