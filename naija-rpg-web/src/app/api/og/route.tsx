import { ImageResponse } from 'next/og';

export async function GET(req: Request) {
  const line = new URL(req.url).searchParams.get('t')?.slice(0, 90) ?? 'Roll the dice. Live the gist.';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: 'linear-gradient(135deg,#08100d 0%,#0e3a28 100%)', color: '#f2f7f4' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: 28, background: '#1fc77e', color: '#04110b', fontSize: 56, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 28 }}>20</div>
          <div style={{ fontSize: 84, fontWeight: 800, display: 'flex' }}>Naija RPG</div>
        </div>
        <div style={{ fontSize: 48, marginTop: 48, color: '#ffc233', display: 'flex' }}>{line}</div>
        <div style={{ fontSize: 30, marginTop: 24, color: '#8aa396', display: 'flex' }}>Real Naija wahala. One d20. Play free in your browser.</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}