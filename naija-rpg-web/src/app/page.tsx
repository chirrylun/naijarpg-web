'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MotionConfig, motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useConn } from '@/stores/connection';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';
import { Button } from '@/components/ui/Button';
import { Person, SceneStyles } from '../features/scene/People';
import type { PersonProps } from '../features/scene/People'
import { StatsStrip } from '@/features/landing/StatsStrip';
import { TopThree } from '@/features/landing/TopThree';
import { HeroCard } from '@/features/landing/HeroCard';
import { HowItWorks } from '@/features/landing/HowItWorks';
import type { Landing } from '@/types';

// Places players end up in. Swap the hooks for your real scenarios any time.
const PLACES = [
  { icon: '🚌', name: 'Danfo stop', hook: 'One seat left and somebody is already running for it.' },
  { icon: '🛒', name: 'Market street', hook: 'The agbero wants his money.' },
  { icon: '🍲', name: 'Mama put', hook: 'The queue is long and the rice is almost finished.' },
  { icon: '🔌', name: 'Your compound', hook: 'No light, and the generator will not start.' },
];

type Walker = {
  id: string;
  /** 1 walks left to right, -1 right to left */
  dir: 1 | -1;
  /** feet line: bigger = closer to the viewer */
  y: number;
  scale: number;
  /** seconds to cross the whole street */
  dur: number;
  /** negative seconds = start part-way across, so the street is busy on first paint */
  delay: number;
  /** where they stand if the user prefers reduced motion */
  x0: number;
  step: number;
  bubble?: boolean;
  look: PersonProps;
};

// The player first, then everyday people going about their day.
const WALKERS: Walker[] = [
  {
    id: 'you', dir: 1, y: 212, scale: 1, dur: 34, delay: -17, x0: 600, step: 0.8, bubble: true,
    look: { skin: '#8a5a3c', top: '#1fc77e', bottom: '#26324f', shoes: '#f5f5f5', head: 'cap', headColor: '#1c2733' },
  },
  {
    id: 'woman-gele', dir: -1, y: 204, scale: 0.92, dur: 27, delay: -5, x0: 330, step: 0.75,
    look: { skin: '#7a4a30', top: '#e0892f', bottom: '#d6336c', shoes: '#f0e6d2', head: 'gele', headColor: '#d6336c', dress: true },
  },
  {
    id: 'man-hurry', dir: 1, y: 208, scale: 0.97, dur: 21, delay: -14, x0: 820, step: 0.62,
    look: { skin: '#a56b46', top: '#e8efe9', bottom: '#222a3a', shoes: '#15191c', head: 'hair' },
  },
  {
    id: 'woman-load', dir: -1, y: 201, scale: 0.88, dur: 38, delay: -22, x0: 1000, step: 0.95,
    look: { skin: '#6b4128', top: '#d9a21b', bottom: '#2a5c8a', shoes: '#f5f5f5', head: 'bundle', headColor: '#2a5c8a', dress: true },
  },
  {
    id: 'man-cap', dir: -1, y: 206, scale: 0.95, dur: 24, delay: -1, x0: 150, step: 0.7,
    look: { skin: '#8a5a3c', top: '#c9473f', bottom: '#2b2f3a', shoes: '#e9e9e9', head: 'cap', headColor: '#2b2f3a' },
  },
  {
    id: 'woman-red', dir: 1, y: 203, scale: 0.9, dur: 30, delay: -8, x0: 450, step: 0.85,
    look: { skin: '#8a5a3c', top: '#c9473f', bottom: '#ffc233', shoes: '#f0e6d2', head: 'gele', headColor: '#2a5c8a', dress: true },
  },
  {
    id: 'man-blue', dir: -1, y: 210, scale: 1, dur: 29, delay: -20, x0: 700, step: 0.72,
    look: { skin: '#a56b46', top: '#3b6ea5', bottom: '#1d2430', shoes: '#15191c', head: 'hair' },
  },
];

/** Lagos street at dusk, looping: a danfo drives through while people walk by. Pure SVG, no image files. */
function StreetStrip() {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nrpg-glow">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nrpg-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </linearGradient>
        <g id="nrpg-palm">
          <path d="M0 168 Q8 130 -4 94" stroke="#10211a" strokeWidth="6" strokeLinecap="round" fill="none" />
          <g stroke="#143025" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M-4 94 Q-30 82 -48 96" />
            <path d="M-4 94 Q-22 68 -46 68" />
            <path d="M-4 94 Q-2 70 -6 56" />
            <path d="M-4 94 Q18 70 42 66" />
            <path d="M-4 94 Q26 84 46 98" />
          </g>
        </g>
      </defs>

      {/* far skyline */}
      <path
        fill="#1a2e27"
        opacity="0.85"
        d="M0 168 V112 H48 V88 H90 V118 H140 V96 H182 V70 H222 V108 H280 V92 H326 V124 H400 V100 H446 V132 H520 V110 H570 V90 H610 V126 H690 V104 H740 V84 H780 V120 H850 V92 H900 V58 H924 V40 H930 V58 H950 V98 H1010 V124 H1080 V102 H1130 V116 H1200 V168 Z"
      />
      <g fill="#ffd27a" opacity="0.5">
        <rect x="58" y="96" width="4" height="6" />
        <rect x="68" y="96" width="4" height="6" />
        <rect x="190" y="80" width="4" height="6" />
        <rect x="204" y="88" width="4" height="6" />
        <rect x="590" y="100" width="4" height="6" />
        <rect x="598" y="108" width="4" height="6" />
        <rect x="756" y="94" width="4" height="6" />
        <rect x="764" y="102" width="4" height="6" />
        <rect x="908" y="74" width="4" height="6" />
        <rect x="914" y="84" width="4" height="6" />
        <rect x="1040" y="112" width="4" height="6" />
      </g>

      {/* low houses with zinc roofs */}
      <g fill="#213a2f">
        <path d="M0 168 V140 L36 126 L72 140 V168 Z" />
        <path d="M84 168 V146 L124 132 L164 146 V168 Z" />
        <path d="M1000 168 V142 L1040 128 L1080 142 V168 Z" />
        <path d="M1092 168 V136 L1140 120 L1190 136 V168 Z" />
      </g>
      <g fill="#ffd27a" opacity="0.5">
        <rect x="26" y="148" width="8" height="10" />
        <rect x="1118" y="146" width="8" height="10" />
        <rect x="1150" y="146" width="8" height="10" />
      </g>

      {/* palms */}
      <use href="#nrpg-palm" x="150" />
      <use href="#nrpg-palm" x="1030" />

      {/* street lamp */}
      <circle cx="270" cy="92" r="48" fill="url(#nrpg-glow)" className="animate-glow" />
      <rect x="248" y="92" width="5" height="76" fill="#0f1a16" />
      <path d="M250 94 Q250 84 266 84" stroke="#0f1a16" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="262" y="82" width="16" height="5" rx="2" fill="#0f1a16" />

      {/* mama put kiosk */}
      <g transform="translate(-142 0)">
        <rect x="472" y="118" width="128" height="50" fill="#2d3f36" />
        <rect x="484" y="128" width="104" height="14" fill="#ffcf70" opacity="0.35" />
        <rect x="480" y="142" width="112" height="26" fill="#1a2a23" />
        <g opacity="0.85">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={468 + i * 17} y="112" width={17} height={14} fill={i % 2 ? '#dfe8e2' : '#2fae78'} />
          ))}
        </g>
        <rect x="486" y="96" width="96" height="14" rx="3" fill="#0f1a16" />
        <text x="534" y="107" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1.5" fill="#ffd27a">
          MAMA PUT
        </text>
      </g>

      {/* road */}
      <rect x="0" y="168" width="1200" height="52" fill="#151f1b" />
      <rect x="0" y="168" width="1200" height="8" fill="#1d2b25" />
      <line x1="0" y1="198" x2="1200" y2="198" stroke="#e6c75a" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="36 28" />

      {/* the danfo drives through, then loops */}
      <g className="nrpg-bus">
        <g className="nrpg-bounce">
          <ellipse cx="0" cy="172" rx="112" ry="6" fill="#000" opacity="0.35" />
          <path d="M100 148 L200 128 V186 L100 158 Z" fill="url(#nrpg-beam)" />
          <path d="M-88 112 Q-84 92 -60 92 H72 Q92 92 96 112 Z" fill="#d9a21b" />
          <rect x="-100" y="112" width="200" height="50" rx="10" fill="#d9a21b" />
          <rect x="-100" y="134" width="200" height="10" fill="#12120f" />
          <g fill="#243740">
            <rect x="-78" y="100" width="30" height="24" rx="4" />
            <rect x="-42" y="100" width="30" height="24" rx="4" />
            <rect x="-6" y="100" width="30" height="24" rx="4" />
            <rect x="30" y="100" width="30" height="24" rx="4" />
            <path d="M68 100 H88 L96 124 H68 Z" />
          </g>
          <g fill="#101d22">
            <circle cx="-63" cy="114" r="5" />
            <circle cx="9" cy="114" r="5" />
            <circle cx="45" cy="115" r="5" />
          </g>
          <path d="M-74 124 L-58 100 H-48 L-64 124 Z" fill="#fff" opacity="0.1" />
          <rect x="92" y="156" width="10" height="6" fill="#1a1a16" />
          <rect x="-100" y="146" width="4" height="8" fill="#e5484d" />
          <circle cx="97" cy="150" r="5" fill="#fff3c4" />
          {[-50, 60].map((x) => (
            <g key={x} transform={`translate(${x} 166)`}>
              <circle r="15" fill="#0d1311" />
              <g className="nrpg-spin">
                <circle r="6" fill="#8a948f" />
                <path d="M-6 0 H6 M0 -6 V6" stroke="#0d1311" strokeWidth="2" />
              </g>
            </g>
          ))}
        </g>
      </g>

      {/* people walking by, in front of the danfo */}
      {WALKERS.map((w) => (
        <g key={w.id} transform={`translate(0 ${w.y})`}>
          <g
            className={`nrpg-track${w.dir < 0 ? ' rev' : ''}`}
            style={{ '--dur': `${w.dur}s`, '--tdelay': `${w.delay}s`, '--x0': `${w.x0}px` } as CSSProperties}
          >
            <g transform={`scale(${w.scale})`}>
              <Person {...w.look} pose="walk" step={w.step} flip={w.dir < 0} />
              {w.bubble && (
                <g className="nrpg-float">
                  <rect x="-98" y="-114" width="196" height="30" rx="15" fill="#1c2e27" stroke="#33493d" strokeWidth="1.5" />
                  <path d="M-7 -84.5 L0 -76 L7 -84.5" fill="#1c2e27" stroke="#33493d" strokeWidth="1.5" strokeLinejoin="round" />
                  <rect x="-8" y="-86" width="16" height="3" fill="#1c2e27" />
                  <text
                    x="0"
                    y="-94"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="700"
                    fill="#f4f8f5"
                    style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}
                  >
                    Last danfo. One seat… 🤔
                  </text>
                </g>
              )}
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const qc = useQueryClient();
  const live = useConn((s) => s.liveUsers);
  const [starting, setStarting] = useState(false);

  // pause the street loop while it is off screen (saves battery on phones)
  const streetRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = streetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['landing'],
    queryFn: () => api<Landing>('/api/stats/landing', { auth: false }),
    refetchInterval: 30_000,
  });

  useEffect(() => {
    // remember a referral link until a player exists
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem('nrpg_ref', ref.toUpperCase());
    // count one visit per browser session
    if (!sessionStorage.getItem('nrpg_visit')) {
      sessionStorage.setItem('nrpg_visit', '1');
      api('/api/stats/visit', { method: 'POST', auth: false })
        .then(() => qc.invalidateQueries({ queryKey: ['landing'] }))
        .catch(() => {});
    }
  }, [qc]);

  async function play() {
    setStarting(true);
    try {
      await useSession.getState().ensureSession();
      router.push('/play');
    } catch {
      setStarting(false);
      useToast.getState().push("Couldn't start. Check your network and try again.", 'bad');
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <SceneStyles />
      <div className="space-y-8 sm:space-y-10">
        {/* Hero: dusk sky, the pitch and a sample scene up top, a living Lagos street underneath */}
        <section className="sim-sky relative overflow-hidden rounded-[1.75rem] border border-line shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)] sm:rounded-[2rem]">
          <div className="bg-ankara mask-fade-down pointer-events-none absolute inset-0 opacity-[0.06]" />

          <div className="relative z-10 grid items-center gap-7 px-4 pt-7 sm:px-6 md:grid-cols-2 md:gap-8 md:px-10 md:pt-12">
            <div className="min-w-0">
              <p className="mb-3 inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                Free in your browser
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight min-[400px]:text-5xl sm:text-6xl">
                Life happens.
                <br />
                <span className="text-brand">Roll the dice.</span>
              </h1>
              <p className="mt-4 max-w-md text-base text-ink/80 sm:text-lg">
                It&apos;s 8:35pm and it&apos;s the last danfo. There&apos;s only one seat left but you see somebody already running for it. What do you do? Play short 2-minute stories from everyday Nigerian life, against your friends or with them.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button size="lg" loading={starting} onClick={play} className="w-full sm:w-auto">
                  Play now
                </Button>
                <Button size="lg" variant="ghost" onClick={play} className="w-full sm:w-auto">
                  Challenge a friend
                </Button>
              </div>
            </div>
            <div className="hidden min-w-0 md:block">
              <HeroCard />
            </div>
          </div>

          <div ref={streetRef} data-paused={!onScreen} className="relative z-10 mt-6 h-44 [contain:paint] sm:mt-4 sm:h-56">
            <StreetStrip />
          </div>
        </section>

        {/* phones: the sample scene sits right under the street instead of pushing it off screen */}
        <div className="px-1 pt-2 md:hidden">
          <HeroCard />
        </div>

        <StatsStrip live={live ?? data?.liveUsers ?? 0} visits={data?.totalVisits ?? 0} topScore={data?.topPlayers[0]?.score ?? 0} />

        <section>
          <h2 className="font-display text-2xl font-extrabold">Where the wahala happens</h2>
          <p className="mb-3 mt-1 text-sm text-mute">Short scenes from everyday Nigerian life. New spot, new problem.</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PLACES.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ y: 14, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.06 * i }}
                className="sim-panel min-w-0 rounded-3xl p-3.5 sm:p-4"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl border border-line bg-night/60 text-2xl">{p.icon}</div>
                <div className="mt-3 font-display text-lg font-extrabold leading-tight">{p.name}</div>
                <p className="mt-1 text-sm text-mute">{p.hook}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <TopThree players={data?.topPlayers ?? []} loading={isLoading} />
        <HowItWorks />

        <footer className="pb-4 text-center text-xs text-mute">Naija RPG · Roll responsibly 🎲</footer>
      </div>
    </MotionConfig>
  );
}