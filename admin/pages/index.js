import Link from 'next/link';

export default function AdminHome() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Admin – SolarSwap</h1>
      <p><Link href="/offers">View Offers</Link> | <Link href="/trades">View Trades</Link></p>
    </div>
  );
}
