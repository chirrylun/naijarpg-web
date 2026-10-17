import type { CSSProperties, ReactNode } from 'react';

/** Stage space. People stand on GROUND; anything smaller is further back. */
export const W = 600;
export const H = 220;
export const GROUND = 182;

export type Mood = {
  sky: [string, string, string];
  far: string;
  mid: string;
  road: string;
  curb: string;
  line: string;
  window: string;
  stars?: boolean;
};

export const DUSK: Mood = {
  sky: ['#1f3d37', '#3a5a47', '#e38b3f'],
  far: '#1a2e27',
  mid: '#213a2f',
  road: '#151f1b',
  curb: '#1d2b25',
  line: '#e6c75a',
  window: '#ffd27a',
};

export const NIGHT: Mood = {
  sky: ['#060c0a', '#0c1814', '#142520'],
  far: '#0c1713',
  mid: '#101d18',
  road: '#0b1310',
  curb: '#121c17',
  line: '#8a7a3a',
  window: '#e9b45a',
  stars: true,
};

export function Sky({ id, mood }: { id: string; mood: Mood }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={mood.sky[0]} />
          <stop offset="0.6" stopColor={mood.sky[1]} />
          <stop offset="1" stopColor={mood.sky[2]} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      {mood.stars &&
        [
          [40, 22], [96, 48], [150, 18], [212, 40], [270, 14], [330, 36], [390, 20], [452, 50], [510, 24], [566, 44], [24, 70], [300, 66], [540, 80],
        ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} fill="#dfe8e2" opacity={0.55} />)}
    </>
  );
}

const BLOCKS: [number, number][] = [
  [40, 46], [30, 70], [44, 54], [36, 86], [50, 60], [34, 44], [46, 76], [38, 58], [52, 92], [30, 50], [44, 68], [38, 48], [46, 80], [34, 62], [40, 52],
];

/** x of each block, worked out once so rendering stays pure. */
const SKY_BLOCKS = BLOCKS.reduce<{ x: number; w: number; h: number }[]>((acc, [w, h]) => {
  const prev = acc[acc.length - 1];
  acc.push({ x: prev ? prev.x + prev.w + 2 : -6, w, h });
  return acc;
}, []);

/** City skyline silhouette, with a few lit windows. */
export function Skyline({ mood, base = 150, lit = true }: { mood: Mood; base?: number; lit?: boolean }) {
  return (
    <g>
      {SKY_BLOCKS.map(({ x, w, h }, i) => (
        <g key={i}>
          <rect x={x} y={base - h} width={w} height={h} fill={mood.far} />
          {lit && i % 2 === 0 && <rect x={x + 8} y={base - h + 12} width={4} height={5} fill={mood.window} opacity={0.5} />}
          {lit && i % 3 === 0 && <rect x={x + 20} y={base - h + 24} width={4} height={5} fill={mood.window} opacity={0.4} />}
        </g>
      ))}
    </g>
  );
}

export function Road({ mood, top = 164, dashed = true }: { mood: Mood; top?: number; dashed?: boolean }) {
  return (
    <g>
      <rect y={top} width={W} height={H - top} fill={mood.road} />
      <rect y={top} width={W} height={6} fill={mood.curb} />
      {dashed && <line x1={0} y1={top + 36} x2={W} y2={top + 36} stroke={mood.line} strokeOpacity={0.35} strokeWidth={2.5} strokeDasharray="30 24" />}
    </g>
  );
}

export function Lamp({ x, lit = true, mood }: { x: number; lit?: boolean; mood: Mood }) {
  return (
    <g>
      {lit && <circle cx={x + 16} cy={86} r={44} fill={mood.window} opacity={0.14} className="stg-glow" />}
      <rect x={x} y={88} width={4} height={80} fill="#0a1310" />
      <path d={`M${x + 2} 90 Q${x + 2} 82 ${x + 16} 82`} stroke="#0a1310" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <rect x={x + 12} y={80} width={14} height={4.5} rx={2} fill="#0a1310" />
      {lit && <rect x={x + 14} y={85} width={10} height={2.4} fill="#fff3c4" className="stg-glow" />}
    </g>
  );
}

export function Palm({ x, base = 168 }: { x: number; base?: number }) {
  return (
    <g transform={`translate(${x} ${base - 168})`}>
      <path d="M0 168 Q6 134 -3 100" stroke="#0e1b15" strokeWidth={5} strokeLinecap="round" fill="none" />
      <g stroke="#12281f" strokeWidth={3.4} strokeLinecap="round" fill="none">
        <path d="M-3 100 Q-26 90 -42 102" />
        <path d="M-3 100 Q-20 76 -40 76" />
        <path d="M-3 100 Q-1 78 -5 66" />
        <path d="M-3 100 Q16 78 36 74" />
        <path d="M-3 100 Q22 92 40 104" />
      </g>
    </g>
  );
}

/** Low house with a zinc roof. */
export function House({ x, w = 80, h = 40, base = 168, mood, windows = 1, fill }: { x: number; w?: number; h?: number; base?: number; mood: Mood; windows?: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x} ${base} V${base - h} L${x + w / 2} ${base - h - 14} L${x + w} ${base - h} V${base} Z`} fill={fill ?? mood.mid} />
      {Array.from({ length: windows }).map((_, i) => (
        <rect key={i} x={x + 12 + i * 22} y={base - h + 10} width={9} height={11} fill={mood.window} opacity={0.55} />
      ))}
    </g>
  );
}

/** Row of shut shops with roller shutters. */
export function Shops({ x, n = 3, base = 168, mood }: { x: number; n?: number; base?: number; mood: Mood }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <g key={i}>
          <rect x={x + i * 58} y={base - 50} width={56} height={50} fill={mood.mid} />
          <rect x={x + i * 58 + 6} y={base - 30} width={44} height={30} fill="#0a1310" opacity={0.7} />
          {[0, 1, 2, 3, 4].map((k) => (
            <line key={k} x1={x + i * 58 + 6} x2={x + i * 58 + 50} y1={base - 26 + k * 6} y2={base - 26 + k * 6} stroke="#1c2a24" strokeWidth={1} />
          ))}
          <rect x={x + i * 58 + 4} y={base - 46} width={48} height={9} rx={2} fill="#0a1310" />
        </g>
      ))}
    </g>
  );
}

/** Concrete wall with a top edge. */
export function Wall({ x, w, h = 46, base = 168, fill = '#2a3a33' }: { x: number; w: number; h?: number; base?: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={fill} />
      <rect x={x} y={base - h} width={w} height={4} fill="#3a4c43" />
    </g>
  );
}

export function Sign({ x, y, w, text, color = '#ffd27a', bg = '#0a1310', className }: { x: number; y: number; w: number; text: string; color?: string; bg?: string; className?: string }) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={15} rx={3} fill={bg} />
      <text x={x + w / 2} y={y + 11} textAnchor="middle" fontSize={9} fontWeight={800} letterSpacing={1.2} fill={color} fontFamily="system-ui, sans-serif">
        {text}
      </text>
    </g>
  );
}

/** A line of cars far down the road, brake lights pulsing. */
export function CarRow({ y, xs, mood, scale = 0.5 }: { y: number; xs: number[]; mood: Mood; scale?: number }) {
  const bodies = ['#c9473f', '#d9a21b', '#e8efe9', '#3b6ea5', '#2b2f3a'];
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${scale})`} opacity={0.9}>
          <rect x={-60} y={-34} width={120} height={26} rx={9} fill={bodies[i % bodies.length]} />
          <path d="M-34 -34 Q-24 -52 -6 -52 H20 Q34 -52 40 -34 Z" fill="#1b2b33" />
          <rect x={-62} y={-26} width={6} height={9} rx={2} fill="#ff5f5f" className="stg-brake" style={{ '--bd': `${i * 0.5}s` } as CSSProperties} />
          <circle cx={-38} cy={-8} r={9} fill="#0d1311" />
          <circle cx={38} cy={-8} r={9} fill="#0d1311" />
          <rect x={-60} y={-12} width={120} height={3} fill={mood.road} opacity={0.4} />
        </g>
      ))}
    </g>
  );
}

export function Group({ children }: { children: ReactNode }) {
  return <g>{children}</g>;
}
