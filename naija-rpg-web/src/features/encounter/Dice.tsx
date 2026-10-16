'use client';

import { useEffect, useRef, useState } from 'react';

type V3 = [number, number, number];

// Icosahedron: 12 corners, 20 triangular faces
const PHI = (1 + Math.sqrt(5)) / 2;
const VERTS: V3[] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const TRIS: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};
const f5 = (n: number) => n.toFixed(5);

type Face = { c: V3; X: V3; Y: V3; Z: V3; value: number; shade: number };

const FACES: Face[] = (() => {
  const faces: Face[] = TRIS.map(([a, b, c]) => {
    const c3: V3 = [
      (VERTS[a][0] + VERTS[b][0] + VERTS[c][0]) / 3,
      (VERTS[a][1] + VERTS[b][1] + VERTS[c][1]) / 3,
      (VERTS[a][2] + VERTS[b][2] + VERTS[c][2]) / 3,
    ];
    const Z = unit(c3); // outward normal
    const up = unit(sub(VERTS[a], c3)); // towards the triangle's top corner
    const Y: V3 = [-up[0], -up[1], -up[2]]; // CSS y points down, so "down" in the face
    const X = cross(Y, Z);
    return { c: c3, X, Y, Z, value: 0, shade: 1 };
  });
  // number the faces like a real d20: opposite faces add up to 21
  let n = 1;
  faces.forEach((f, i) => {
    if (f.value) return;
    const j = faces.findIndex((g, k) => k !== i && !g.value && dot(f.Z, g.Z) < -0.99);
    f.value = n;
    if (j >= 0) faces[j].value = 21 - n;
    n += 1;
  });
  faces.forEach((f) => {
   f.shade = 0.84 + (((f.value * 37) % 11) / 11) * 0.16;
  });
  return faces;
})();

const BY_VALUE = new Map(FACES.map((f) => [f.value, f]));

// Rotation that brings the face carrying `value` to the front, upright
const restMatrix = (value: number) => {
  const { X, Y, Z } = BY_VALUE.get(value) ?? FACES[0];
  return `matrix3d(${f5(X[0])},${f5(Y[0])},${f5(Z[0])},0,${f5(X[1])},${f5(Y[1])},${f5(Z[1])},0,${f5(X[2])},${f5(Y[2])},${f5(Z[2])},0,0,0,0,1)`;
};

const TRI = 'polygon(50% 0%, 100% 100%, 0% 100%)';
const PALETTE = {
  normal: { a: '#ffffff', b: '#e8e4da', edge: '#a8a396', ink: '#17171c' },
  crit: { a: '#fffbe8', b: '#f5e3a6', edge: '#b8963a', ink: '#7a4a00' },
  fumble: { a: '#fff1f1', b: '#f2cccc', edge: '#b58a8a', ink: '#a31212' },
};
const DUR = 1600;

export function Dice({
  value,
  delay = 0,
  size = 120,
  onSettled,
}: {
  value: number;
  delay?: number;
  size?: number;
  onSettled?: () => void;
}) {
  const dieRef = useRef<HTMLDivElement>(null);
  const hopRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const cb = useRef(onSettled);
  const [done, setDone] = useState(false);

  useEffect(() => {
    cb.current = onSettled;
  });

  useEffect(() => {
    const die = dieRef.current;
    const hop = hopRef.current;
    const shadow = shadowRef.current;
    if (!die || !hop || !shadow) return;

    const rest = restMatrix(value);
    let cancelled = false;
    const anims: Animation[] = [];
    const finish = () => {
      if (cancelled) return;
      die.style.transform = rest;
      anims.forEach((a) => a.cancel());
      setDone(true);
      cb.current?.();
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof die.animate !== 'function') {
      finish();
      return;
    }

    // tumble on all three axes, slowing into the resting face
    const ax = 240 + Math.random() * 140;
    const ay = 240 + Math.random() * 140;
    const az = 100 + Math.random() * 100;
    const R = (k: number) => `rotateX(${Math.round(k * ax)}deg) rotateY(${Math.round(k * ay)}deg) rotateZ(${Math.round(k * az)}deg)`;
    const opts = { duration: DUR, delay, fill: 'both' as const };

    const spin = die.animate(
      [
        { transform: R(0) },
        { transform: R(1), offset: 0.3 },
        { transform: R(2), offset: 0.6 },
        { transform: R(3), offset: 0.86 },
        { transform: rest },
      ],
      { ...opts, easing: 'cubic-bezier(0.2, 0.65, 0.25, 1)' },
    );
    spin.onfinish = finish;
    anims.push(spin);

    // dropped onto the table, bouncing lower each time
    const up = size * 0.5;
    const IN = 'cubic-bezier(0.5, 0, 1, 0.6)';
    const OUT = 'cubic-bezier(0, 0.4, 0.5, 1)';
    anims.push(
      hop.animate(
        [
          { transform: `translateY(${-up}px)`, easing: IN },
          { transform: 'translateY(0px)', offset: 0.3, easing: OUT },
          { transform: `translateY(${-up * 0.38}px)`, offset: 0.5, easing: IN },
          { transform: 'translateY(0px)', offset: 0.66, easing: OUT },
          { transform: `translateY(${-up * 0.12}px)`, offset: 0.78, easing: IN },
          { transform: 'translateY(0px)', offset: 0.88 },
          { transform: 'translateY(0px)' },
        ],
        opts,
      ),
    );
    // shadow shrinks while the die is in the air
    anims.push(
      shadow.animate(
        [
          { transform: 'scale(0.5)', opacity: 0.15 },
          { transform: 'scale(1)', opacity: 0.55, offset: 0.3 },
          { transform: 'scale(0.75)', opacity: 0.32, offset: 0.5 },
          { transform: 'scale(1)', opacity: 0.55, offset: 0.66 },
          { transform: 'scale(0.92)', opacity: 0.45, offset: 0.78 },
          { transform: 'scale(1)', opacity: 0.55, offset: 0.88 },
          { transform: 'scale(1)', opacity: 0.55 },
        ],
        opts,
      ),
    );

    return () => {
      cancelled = true;
      anims.forEach((a) => a.cancel());
    };
  }, [value, delay, size]);

  const k = size / 3.8; // 1 unit of the model, in pixels
  const W = 2 * k; // triangle edge
  const H = Math.sqrt(3) * k; // triangle height
  const tone = done && value === 20 ? PALETTE.crit : done && value === 1 ? PALETTE.fumble : PALETTE.normal;
  const glow = done && value === 20;

  return (
    <div
      role="img"
      aria-label={`d20 rolled ${value}`}
      className="relative mx-auto"
      style={{ width: size, height: size * 1.5, perspective: size * 6, perspectiveOrigin: '50% 55%' }}
    >
      {glow && (
        <div
          className="absolute rounded-full"
          style={{
            left: '50%', top: size, width: size * 1.3, height: size * 1.3,
            marginLeft: -size * 0.65, marginTop: -size * 0.65,
            background: 'radial-gradient(circle, rgba(255,194,51,0.45), transparent 65%)',
          }}
        />
      )}
      <div
        ref={shadowRef}
        className="absolute rounded-[50%]"
        style={{
          left: '50%', top: size * 1.44, width: size * 0.7, height: size * 0.12,
          marginLeft: -size * 0.35, background: 'rgba(0,0,0,0.6)', filter: 'blur(6px)', opacity: 0.55,
        }}
      />
      <div ref={hopRef} style={{ position: 'absolute', left: '50%', top: size, width: 0, height: 0, transformStyle: 'preserve-3d' }}>
        <div
          ref={dieRef}
          style={{ position: 'absolute', width: 0, height: 0, transformStyle: 'preserve-3d', transform: restMatrix(value) }}
        >
          {FACES.map((f) => (
            <div
              key={f.value}
              style={{
                position: 'absolute',
                left: -W / 2,
                top: -H / 2,
                width: W,
                height: H,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                clipPath: TRI,
                background: tone.edge,
                transform: `translate3d(${f5(f.c[0] * k)}px,${f5(f.c[1] * k)}px,${f5(f.c[2] * k)}px) matrix3d(${f5(f.X[0])},${f5(f.X[1])},${f5(f.X[2])},0,${f5(f.Y[0])},${f5(f.Y[1])},${f5(f.Y[2])},0,${f5(f.Z[0])},${f5(f.Z[1])},${f5(f.Z[2])},0,0,0,0,1) translateY(${f5(-H / 6)}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: TRI,
                  transform: 'scale(0.9)',
                  transformOrigin: '50% 66.667%',
                  background: `linear-gradient(165deg, ${tone.a}, ${tone.b})`,
                  filter: `brightness(${f.shade})`,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '66.667%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: H * 0.4,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: tone.ink,
                  textDecoration: f.value === 6 || f.value === 9 ? 'underline' : 'none',
                }}
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}