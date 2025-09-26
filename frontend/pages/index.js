import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>☀️ SolarSwap</h1>
      <p>Buy and sell solar energy within your community.</p>
      <p><Link href="/dashboard">Go to Dashboard →</Link></p>
      <p><Link href="/login">Login</Link></p>
    </div>
  );
}
