import { useId } from 'react';
import type { CSSProperties } from 'react';

/* Small things people carry or stand next to. Ground is y = 0, middle is x = 0. */

/** "!" bubble. Place it above a head and give it a popIn beat. */
export function Alert() {
  return (
    <g transform="translate(0 -100)">
      <circle r={9} fill="#ff5f5f" />
      <path d="M-3 8 L0 14 L3 8 Z" fill="#ff5f5f" />
      <rect x={-1.4} y={-5} width={2.8} height={6.5} rx={1.4} fill="#fff" />
      <circle cy={4.5} r={1.6} fill="#fff" />
    </g>
  );
}

/** Phone held up, with a small cold glow. */
export function Phone() {
  return (
    <g transform="translate(15 -50)">
      <circle r={13} fill="#9fd8ff" opacity={0.2} className="stg-flicker" />
      <rect x={-3} y={-6} width={6} height={11} rx={1.5} fill="#10181c" />
      <rect x={-2} y={-5} width={4} height={9} rx={1} fill="#9fd8ff" />
    </g>
  );
}

/** Beam of a torch coming from the right, pointing left once flipped. */
export function Torch() {
  const id = useId().replace(/:/g, '');
  return (
    <g className="stg-flicker">
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d="M-130 -64 L0 -52 V-40 L-130 -8 Z" fill={`url(#${id})`} />
      <circle cx={2} cy={-46} r={5} fill="#fff6cf" />
    </g>
  );
}

export function Lantern() {
  const id = useId().replace(/:/g, '');
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cy={-14} r={44} fill={`url(#${id})`} className="stg-flicker" />
      <rect x={-5} y={-16} width={10} height={16} rx={2} fill="#2b2f3a" />
      <rect x={-3} y={-13} width={6} height={9} rx={1.5} fill="#ffd27a" />
      <path d="M-4 -16 Q0 -24 4 -16" stroke="#2b2f3a" strokeWidth={1.6} fill="none" />
    </g>
  );
}

/** A rope tied across the road between two poles, 160 wide. */
export function Rope() {
  return (
    <g>
      <rect x={-84} y={-62} width={5} height={62} rx={2} fill="#4b3a2a" />
      <rect x={79} y={-62} width={5} height={62} rx={2} fill="#4b3a2a" />
      <path d="M-80 -52 Q0 -40 80 -52" stroke="#d9c27a" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M-80 -50 Q0 -38 80 -50" stroke="#8a7a3a" strokeWidth={1} fill="none" strokeDasharray="3 4" />
    </g>
  );
}

export function Box() {
  return (
    <g>
      <rect x={-18} y={-22} width={36} height={22} rx={3} fill="#8a5a3c" />
      <rect x={-18} y={-22} width={36} height={5} rx={2} fill="#a56b46" />
      <path d="M-4 -17 V0" stroke="#5a3a24" strokeWidth={1.4} />
    </g>
  );
}

/** Airport trolley with bags. */
export function Trolley() {
  return (
    <g>
      <rect x={-22} y={-40} width={30} height={22} rx={3} fill="#3b6ea5" />
      <rect x={-14} y={-52} width={22} height={14} rx={3} fill="#c9473f" />
      <rect x={-22} y={-18} width={44} height={3} fill="#9aa5a0" />
      <path d="M22 -18 L28 -56" stroke="#9aa5a0" strokeWidth={3} strokeLinecap="round" />
      <circle cx={-14} cy={-6} r={5} fill="#0d1311" />
      <circle cx={14} cy={-6} r={5} fill="#0d1311" />
    </g>
  );
}

/** Walking stick, leaning forward. Put it next to a person's front hand. */
export function Stick() {
  return <path d="M0 0 L9 -66" stroke="#6b4a2a" strokeWidth={3.5} strokeLinecap="round" />;
}

export function Zzz() {
  return (
    <g transform="translate(12 -82)" fill="#cfe6d9" fontWeight={800} fontFamily="system-ui, sans-serif">
      <text className="stg-zzz" fontSize={11}>z</text>
      <text className="stg-zzz" fontSize={14} x={8} y={-8} style={{ animationDelay: '.9s' }}>z</text>
    </g>
  );
}

/** Steam puffs from an annoyed head. */
export function Puff() {
  return (
    <g transform="translate(0 -84)" stroke="#e8efe9" strokeWidth={2} strokeLinecap="round" fill="none">
      <path className="stg-puff" d="M-10 0 q-4 -5 0 -9" />
      <path className="stg-puff" d="M10 0 q4 -5 0 -9" style={{ '--pd': '.5s' } as CSSProperties} />
    </g>
  );
}

export function Generator() {
  return (
    <g>
      <rect x={-20} y={-24} width={40} height={24} rx={3} fill="#c9473f" />
      <rect x={-16} y={-20} width={20} height={9} rx={1.5} fill="#2b2f3a" />
      <circle cx={10} cy={-14} r={4} fill="#ffd27a" className="stg-flicker" />
      <rect x={-18} y={-3} width={5} height={4} fill="#1a1a1a" />
      <rect x={13} y={-3} width={5} height={4} fill="#1a1a1a" />
      <path d="M22 -24 q6 -6 4 -14" stroke="#9aa5a0" strokeWidth={2} fill="none" opacity={0.4} className="stg-puff" />
    </g>
  );
}

/** Small plane crossing the sky. */
export function Plane() {
  return (
    <g fill="#dfe8e2" opacity={0.85}>
      <path d="M-18 0 H16 Q22 0 24 -2 Q22 -4 16 -4 H-8 L-16 -12 H-20 L-16 -4 H-24 L-26 -8 H-28 L-26 0 Z" />
      <circle cx={26} cy={-2} r={1.6} fill="#ff5f5f" className="stg-flicker" />
    </g>
  );
}

export function Cones() {
  return (
    <g>
      {[-22, 0, 22].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d="M-5 0 L-2 -16 H2 L5 0 Z" fill="#ff7a2f" />
          <rect x={-3.6} y={-10} width={7.2} height={3} fill="#fff" />
        </g>
      ))}
    </g>
  );
}
