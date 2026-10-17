import type { ReactNode } from 'react';

/* Side-view vehicles. Ground is y = 0, they face RIGHT, and the middle is x = 0. */

type VProps = { moving?: boolean; brake?: boolean };

function Wheel({ x, r = 13, moving }: { x: number; r?: number; moving?: boolean }) {
  return (
    <g transform={`translate(${x} ${-r})`}>
      <circle r={r} fill="#0d1311" />
      <g className={moving ? 'stg-wheel' : undefined}>
        <circle r={r * 0.42} fill="#8a948f" />
        <path d={`M${-r * 0.42} 0 H${r * 0.42} M0 ${-r * 0.42} V${r * 0.42}`} stroke="#0d1311" strokeWidth={2} />
      </g>
    </g>
  );
}

function Shadow({ w }: { w: number }) {
  return <ellipse cx={0} cy={1} rx={w} ry={5} fill="#000" opacity={0.35} />;
}

/** Bolt ride: white saloon with a green sticker and a driver. */
export function Bolt({ moving, brake = true }: VProps) {
  return (
    <g>
      <Shadow w={92} />
      <path d="M-86 -12 Q-86 -22 -72 -25 L-48 -28 Q-36 -50 -14 -50 H26 Q44 -50 54 -28 L76 -24 Q88 -21 88 -12 V-6 H-86 Z" fill="#e9eef0" />
      <path d="M-42 -28 Q-32 -45 -14 -45 H-2 V-28 Z" fill="#243740" />
      <path d="M4 -45 H26 Q40 -45 48 -28 H4 Z" fill="#243740" />
      <circle cx={-14} cy={-36} r={5} fill="#1b2b33" />
      <rect x={-86} y={-14} width={174} height={4} fill="#c5ced2" />
      <rect x={-20} y={-24} width={22} height={9} rx={3} fill="#1fc77e" />
      <circle cx={84} cy={-17} r={4.5} fill="#fff3c4" />
      <rect x={-88} y={-20} width={5} height={9} rx={2} fill="#e5484d" className={brake ? 'stg-brake' : undefined} />
      <Wheel x={-52} moving={moving} />
      <Wheel x={54} moving={moving} />
    </g>
  );
}

export function Suv({ moving }: VProps) {
  return (
    <g>
      <Shadow w={100} />
      <path d="M-96 -12 V-34 Q-96 -42 -86 -42 H-40 Q-32 -64 -10 -64 H44 Q60 -64 66 -42 H86 Q98 -42 98 -30 V-6 H-96 Z" fill="#14181a" />
      <path d="M-34 -42 Q-26 -58 -10 -58 H0 V-42 Z" fill="#2d3c43" />
      <path d="M8 -58 H42 Q54 -58 58 -42 H8 Z" fill="#2d3c43" />
      <rect x={-96} y={-18} width={194} height={4} fill="#2a3236" />
      <rect x={90} y={-30} width={8} height={8} rx={2} fill="#fff3c4" />
      <rect x={-98} y={-32} width={5} height={10} rx={2} fill="#e5484d" className="stg-brake" />
      <Wheel x={-58} r={15} moving={moving} />
      <Wheel x={62} r={15} moving={moving} />
    </g>
  );
}

/** Yellow-green tricycle. */
export function Keke({ moving }: VProps) {
  return (
    <g>
      <Shadow w={52} />
      <path d="M-50 -14 V-44 Q-50 -56 -38 -56 H8 Q22 -56 30 -42 L40 -30 V-14 Z" fill="#f2c230" />
      <path d="M-52 -58 H20 Q28 -58 30 -50 H-52 Z" fill="#1c6b47" />
      <path d="M-44 -44 H4 Q14 -44 20 -32 H-44 Z" fill="#243740" />
      <rect x={-50} y={-16} width={90} height={5} fill="#1c6b47" />
      <circle cx={42} cy={-22} r={4} fill="#fff3c4" />
      <rect x={-52} y={-30} width={4} height={8} fill="#e5484d" className="stg-brake" />
      <Wheel x={-30} r={11} moving={moving} />
      <Wheel x={-8} r={11} moving={moving} />
      <Wheel x={36} r={10} moving={moving} />
    </g>
  );
}

/** Okada: motorbike and rider. */
export function Okada({ moving }: VProps) {
  return (
    <g>
      <Shadow w={34} />
      <Wheel x={-24} r={11} moving={moving} />
      <Wheel x={26} r={11} moving={moving} />
      <path d="M-24 -11 L-6 -26 H14 L26 -11" stroke="#2c3338" strokeWidth={4} fill="none" strokeLinejoin="round" />
      <rect x={-18} y={-30} width={26} height={7} rx={3} fill="#c9473f" />
      <path d="M22 -34 L32 -40" stroke="#2c3338" strokeWidth={3} strokeLinecap="round" />
      <circle cx={30} cy={-18} r={3} fill="#fff3c4" />
      {/* rider */}
      <path d="M-8 -30 Q-4 -50 4 -52" stroke="#e8efe9" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M4 -48 L22 -40" stroke="#8a5a3c" strokeWidth={4} strokeLinecap="round" />
      <circle cx={6} cy={-62} r={7} fill="#8a5a3c" />
      <path d="M-1 -64 Q6 -73 13 -64 Z" fill="#2b2f3a" />
    </g>
  );
}

/** Lagos danfo: yellow bus with the black band. */
export function Danfo({ moving }: VProps) {
  return (
    <g>
      <ellipse cx={0} cy={1} rx={112} ry={6} fill="#000" opacity={0.35} />
      <path d="M-88 -56 Q-84 -76 -60 -76 H72 Q92 -76 96 -56 Z" fill="#d9a21b" />
      <rect x={-100} y={-56} width={200} height={50} rx={10} fill="#d9a21b" />
      <rect x={-100} y={-34} width={200} height={10} fill="#12120f" />
      <g fill="#243740">
        {[-78, -42, -6, 30].map((x) => (
          <rect key={x} x={x} y={-68} width={30} height={24} rx={4} />
        ))}
        <path d="M68 -68 H88 L96 -44 H68 Z" />
      </g>
      <rect x={-100} y={-22} width={4} height={8} fill="#e5484d" />
      <circle cx={97} cy={-18} r={5} fill="#fff3c4" />
      <Wheel x={-50} r={15} moving={moving} />
      <Wheel x={60} r={15} moving={moving} />
    </g>
  );
}

export const VEHICLES: Record<'bolt' | 'suv' | 'keke' | 'okada' | 'danfo', (p: VProps) => ReactNode> = {
  bolt: Bolt,
  suv: Suv,
  keke: Keke,
  okada: Okada,
  danfo: Danfo,
};
