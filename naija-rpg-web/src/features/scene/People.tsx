import type { CSSProperties, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Shared motion for the landing street + the mode-card art.          */
/*  Everything is CSS-driven (transform only), so it stays light on    */
/*  phones, and it all switches off for prefers-reduced-motion.        */
/* ------------------------------------------------------------------ */

const SCENE_CSS = `
.nrpg-track{transform:translateX(var(--x0,0px));animation:nrpg-track var(--dur,30s) linear infinite;animation-delay:var(--tdelay,0s);will-change:transform}
.nrpg-track.rev{animation-direction:reverse}
@keyframes nrpg-track{from{transform:translateX(-120px)}to{transform:translateX(1320px)}}

.nrpg-bus{transform:translateX(600px);animation:nrpg-bus 19s linear infinite;animation-delay:-7s;will-change:transform}
@keyframes nrpg-bus{from{transform:translateX(-130px)}to{transform:translateX(1330px)}}
.nrpg-bounce{animation:nrpg-bounce .42s ease-in-out infinite}
@keyframes nrpg-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}
.nrpg-spin{animation:nrpg-spin .5s linear infinite}
@keyframes nrpg-spin{to{transform:rotate(360deg)}}

.nrpg-leg{animation:nrpg-leg var(--step,.8s) ease-in-out infinite}
.nrpg-leg.rev{animation-direction:reverse}
@keyframes nrpg-leg{0%,100%{transform:rotate(28deg)}50%{transform:rotate(-28deg)}}
.nrpg-arm{animation:nrpg-arm var(--step,.8s) ease-in-out infinite}
.nrpg-arm.rev{animation-direction:reverse}
@keyframes nrpg-arm{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(22deg)}}
.nrpg-bob{animation:nrpg-bob calc(var(--step,.8s) / 2) ease-in-out infinite}
@keyframes nrpg-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}

.nrpg-guard{animation:nrpg-guard 1.1s ease-in-out infinite;animation-delay:var(--delay,0s)}
@keyframes nrpg-guard{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-2px) rotate(2.5deg)}}
.nrpg-jab{animation:nrpg-jab .9s ease-in-out infinite;animation-delay:var(--delay,0s)}
@keyframes nrpg-jab{0%,55%,100%{transform:translateX(0)}70%{transform:translateX(5px)}}

.nrpg-hop{animation:nrpg-hop 1.2s ease-in-out infinite}
@keyframes nrpg-hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
.nrpg-wave{transform-origin:60px 64px;animation:nrpg-wave .9s ease-in-out infinite}
@keyframes nrpg-wave{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
.nrpg-pulse{transform-box:fill-box;transform-origin:center;animation:nrpg-pulse 1.4s ease-in-out infinite}
@keyframes nrpg-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.18);opacity:1}}
.nrpg-float{animation:nrpg-float 3s ease-in-out infinite}
@keyframes nrpg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}

[data-paused="true"] *{animation-play-state:paused!important}

@media (prefers-reduced-motion:reduce){
  .nrpg-track,.nrpg-bus,.nrpg-bounce,.nrpg-spin,.nrpg-leg,.nrpg-arm,.nrpg-bob,.nrpg-guard,.nrpg-jab,.nrpg-hop,.nrpg-wave,.nrpg-pulse,.nrpg-float{animation:none!important}
}
`;

/** Renders the shared keyframes once (React 19 dedupes by href). */
export function SceneStyles() {
  return (
    <style href="nrpg-scene" precedence="default">
      {SCENE_CSS}
    </style>
  );
}

/* ------------------------------------------------------------------ */
/*  Side-view person. Feet sit at (0,0), figure is ~70 units tall,     */
/*  faces right. Use `flip` to face left.                              */
/* ------------------------------------------------------------------ */

export type PersonProps = {
  skin?: string;
  top?: string;
  /** trousers colour, or the waist-band colour when `dress` is set */
  bottom?: string;
  shoes?: string;
  head?: 'cap' | 'hair' | 'gele' | 'bundle';
  headColor?: string;
  dress?: boolean;
  pose?: 'walk' | 'guard' | 'stand';
  /** seconds per full stride (smaller = brisker) */
  step?: number;
  /** seconds, desyncs the fighters */
  delay?: number;
  flip?: boolean;
};

function Leg({ cls, rot = 0, fill, shoe, back }: { cls?: string; rot?: number; fill: string; shoe: string; back?: boolean }) {
  return (
    <g transform="translate(0 -30)">
      <g className={cls} transform={cls ? undefined : `rotate(${rot})`}>
        <rect x={-3} y={0} width={6} height={25} rx={3} fill={fill} stroke={back ? 'rgba(0,0,0,.28)' : undefined} strokeWidth={0.8} />
        <rect x={-3} y={22} width={11} height={6} rx={3} fill={shoe} />
      </g>
    </g>
  );
}

function HangingArm({ cls, rot = 0, skin, top, back }: { cls?: string; rot?: number; skin: string; top: string; back?: boolean }) {
  return (
    <g transform="translate(0 -49)">
      <g className={cls} transform={cls ? undefined : `rotate(${rot})`}>
        <rect x={-2.5} y={0} width={5} height={21} rx={2.5} fill={skin} stroke={back ? 'rgba(0,0,0,.28)' : undefined} strokeWidth={0.8} />
        <rect x={-3} y={0} width={6} height={9} rx={3} fill={top} />
      </g>
    </g>
  );
}

export function Person({
  skin = '#8a5a3c',
  top = '#1fc77e',
  bottom = '#26324f',
  shoes = '#f5f5f5',
  head = 'hair',
  headColor = '#1c2733',
  dress = false,
  pose = 'stand',
  step = 0.8,
  delay = 0,
  flip = false,
}: PersonProps) {
  const walk = pose === 'walk';
  const guard = pose === 'guard';
  const legFill = dress ? skin : bottom;
  const vars = { '--step': `${step}s`, '--delay': `${delay}s` } as CSSProperties;

  let headwear: ReactNode;
  if (head === 'cap') {
    headwear = (
      <>
        <path d="M-6.5 -63.5 Q1.5 -74 9.5 -63.5 Z" fill={headColor} />
        <path d="M7 -64.5 H14 Q14 -62 8 -62.5 Z" fill={headColor} />
      </>
    );
  } else if (head === 'gele') {
    headwear = (
      <>
        <path d="M-9 -63 Q-13 -78 2 -76 Q15 -81 12 -66 Q2 -69 -9 -63 Z" fill={headColor} />
        <path d="M-5 -70 Q3 -75 10 -70" stroke="#ffc233" strokeWidth={1.4} fill="none" />
      </>
    );
  } else if (head === 'bundle') {
    headwear = (
      <>
        <path d="M-7 -63 Q1.5 -71 9 -64 Z" fill={headColor} />
        <ellipse cx={1.5} cy={-74} rx={10} ry={5.5} fill="#c9a45a" />
        <path d="M-6 -74 H9" stroke="#8a6a2c" strokeWidth={1.2} />
      </>
    );
  } else {
    headwear = <path d="M-6.5 -62 Q-6 -72 3 -70 Q9 -69 9 -64 Q3 -66 -6.5 -62 Z" fill="#1a1a1a" />;
  }

  return (
    <g transform={flip ? 'scale(-1 1)' : undefined} style={vars}>
      <ellipse cx={0} cy={0} rx={13} ry={2.6} fill="#000" opacity={0.3} />
      <g className={walk ? 'nrpg-bob' : guard ? 'nrpg-guard' : undefined}>
        {/* back arm + back leg */}
        {guard ? (
          <g>
            <path d="M0 -49 L6 -39 L14 -47" stroke={skin} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M0 -49 L3 -44" stroke={top} strokeWidth={6} strokeLinecap="round" fill="none" />
            <circle cx={15} cy={-48} r={3.6} fill={skin} />
          </g>
        ) : (
          <HangingArm cls={walk ? 'nrpg-arm' : undefined} rot={4} skin={skin} top={top} back />
        )}
        <Leg cls={walk ? 'nrpg-leg rev' : undefined} rot={guard ? 18 : 4} fill={legFill} shoe={shoes} back />

        {/* torso */}
        {dress ? (
          <>
            <path d="M-7 -52 Q0 -55 7 -52 L11 -22 Q0 -18 -11 -22 Z" fill={top} />
            <path d="M-8.5 -33 Q0 -30 8.5 -33" stroke={bottom} strokeWidth={3} fill="none" />
          </>
        ) : (
          <rect x={-6.5} y={-52} width={13} height={24} rx={5} fill={top} />
        )}
        <rect x={-2} y={-56} width={4} height={6} fill={skin} />

        {/* head */}
        <circle cx={1.5} cy={-61} r={7.5} fill={skin} />
        <circle cx={9} cy={-60.5} r={1.7} fill={skin} />
        <circle cx={5} cy={-62} r={1} fill="#1a1a1a" />
        {guard && <path d="M2.5 -65.5 L7.5 -64" stroke="#1a1a1a" strokeWidth={1.2} strokeLinecap="round" />}
        {headwear}

        {/* front leg + front arm */}
        <Leg cls={walk ? 'nrpg-leg' : undefined} rot={guard ? -14 : -4} fill={legFill} shoe={shoes} />
        {guard ? (
          <g className="nrpg-jab">
            <path d="M0 -49 L10 -41 L20 -52" stroke={skin} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M0 -49 L4 -46" stroke={top} strokeWidth={6} strokeLinecap="round" fill="none" />
            <circle cx={21} cy={-53} r={4} fill={skin} />
          </g>
        ) : (
          <HangingArm cls={walk ? 'nrpg-arm rev' : undefined} rot={-4} skin={skin} top={top} />
        )}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode-card art                                                      */
/* ------------------------------------------------------------------ */

const FLOOR = '#16221d';

/** Face Off: two players squaring up. */
export function FaceOffArt({ className }: { className?: string }) {
  return (
    <>
      <SceneStyles />
      <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMax meet" className={className} role="img" aria-label="Two players facing off">
        <rect x={0} y={118} width={200} height={12} fill={FLOOR} />
        <g transform="translate(56 118) scale(1.1)">
          <Person pose="guard" skin="#8a5a3c" top="#1fc77e" bottom="#26324f" shoes="#f5f5f5" head="cap" headColor="#1c2733" />
        </g>
        <g transform="translate(144 118) scale(1.1)">
          <Person pose="guard" flip delay={0.55} skin="#6b4128" top="#d64545" bottom="#2b2f3a" shoes="#e9e9e9" head="hair" />
        </g>
        <polygon className="nrpg-pulse" points="104,44 94,68 101,68 96,88 110,62 103,62" fill="#ffc233" />
      </svg>
    </>
  );
}

/* Front-view friends, drawn so their arms can wrap over each other. */

function FriendBody({ cx, skin, top, bottom, shoes, dress }: { cx: number; skin: string; top: string; bottom: string; shoes: string; dress?: boolean }) {
  return (
    <g>
      {dress ? (
        <>
          <rect x={cx - 9} y={104} width={7} height={16} rx={3} fill={skin} />
          <rect x={cx + 2} y={104} width={7} height={16} rx={3} fill={skin} />
        </>
      ) : (
        <>
          <rect x={cx - 11} y={94} width={10} height={27} rx={4} fill={bottom} />
          <rect x={cx + 1} y={94} width={10} height={27} rx={4} fill={bottom} />
        </>
      )}
      <rect x={cx - 12} y={118} width={12} height={6} rx={3} fill={shoes} />
      <rect x={cx} y={118} width={12} height={6} rx={3} fill={shoes} />
      <rect x={cx - 4} y={50} width={8} height={10} fill={skin} />
      {dress ? (
        <>
          <path d={`M${cx - 16} 64 Q${cx - 16} 57 ${cx - 8} 57 H${cx + 8} Q${cx + 16} 57 ${cx + 16} 64 L${cx + 21} 108 Q${cx} 113 ${cx - 21} 108 Z`} fill={top} />
          <path d={`M${cx - 14} 82 Q${cx} 86 ${cx + 14} 82`} stroke={bottom} strokeWidth={3} fill="none" />
        </>
      ) : (
        <path d={`M${cx - 16} 64 Q${cx - 16} 57 ${cx - 8} 57 H${cx + 8} Q${cx + 16} 57 ${cx + 16} 64 L${cx + 14} 98 H${cx - 14} Z`} fill={top} />
      )}
    </g>
  );
}

function FriendHead({ cx, skin, head, headColor }: { cx: number; skin: string; head: 'cap' | 'gele'; headColor: string }) {
  return (
    <g>
      <circle cx={cx} cy={38} r={14} fill={skin} />
      <circle cx={cx - 5} cy={41} r={1.8} fill="#1a1a1a" />
      <circle cx={cx + 5} cy={41} r={1.8} fill="#1a1a1a" />
      <path d={`M${cx - 5} 46 Q${cx} 51 ${cx + 5} 46`} stroke="#1a1a1a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {head === 'cap' ? (
        <>
          <path d={`M${cx - 14} 35 Q${cx - 14} 19 ${cx} 19 Q${cx + 14} 19 ${cx + 14} 35 Z`} fill={headColor} />
          <rect x={cx - 16} y={33} width={32} height={4} rx={2} fill={headColor} />
        </>
      ) : (
        <>
          <path d={`M${cx - 16} 34 Q${cx - 22} 10 ${cx - 4} 12 Q${cx + 4} 4 ${cx + 14} 12 Q${cx + 24} 14 ${cx + 16} 34 Q${cx} 26 ${cx - 16} 34 Z`} fill={headColor} />
          <path d={`M${cx - 12} 24 Q${cx} 18 ${cx + 12} 24`} stroke="#ffc233" strokeWidth={2} fill="none" />
        </>
      )}
    </g>
  );
}

/** Link Up: two friends, arms over each other's shoulders. */
export function FriendsArt({ className }: { className?: string }) {
  const A = { cx: 76, skin: '#8a5a3c', top: '#1fc77e', bottom: '#26324f', shoes: '#f5f5f5' };
  const B = { cx: 124, skin: '#7a4a30', top: '#e0892f', bottom: '#d6336c', shoes: '#f0e6d2' };
  return (
    <>
      <SceneStyles />
      <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMax meet" className={className} role="img" aria-label="Two friends teaming up">
        <rect x={0} y={118} width={200} height={12} fill={FLOOR} />
        <g transform="translate(0 -6)">
          <g className="nrpg-hop">
            <FriendBody {...A} />
            <FriendBody {...B} dress />

            {/* A's arm across B's shoulders */}
            <path d="M91 63 Q118 50 141 63" stroke={A.skin} strokeWidth={7} strokeLinecap="round" fill="none" />
            <path d="M91 63 Q97 60 103 58.5" stroke={A.top} strokeWidth={8} strokeLinecap="round" fill="none" />
            <circle cx={141} cy={64} r={4.5} fill={A.skin} />

            {/* B's arm around A's waist */}
            <path d="M110 64 Q106 88 90 94" stroke={B.skin} strokeWidth={7} strokeLinecap="round" fill="none" />
            <path d="M110 64 Q109 71 108 77" stroke={B.top} strokeWidth={8} strokeLinecap="round" fill="none" />
            <circle cx={89} cy={95} r={4.5} fill={B.skin} />

            {/* B's free arm */}
            <path d="M140 64 Q146 82 143 98" stroke={B.skin} strokeWidth={7} strokeLinecap="round" fill="none" />
            <path d="M140 64 Q142 70 143 76" stroke={B.top} strokeWidth={8} strokeLinecap="round" fill="none" />
            <circle cx={143} cy={99} r={4.5} fill={B.skin} />

            {/* A waves with the free arm */}
            <g className="nrpg-wave">
              <path d="M60 64 Q47 56 45 40" stroke={A.skin} strokeWidth={7} strokeLinecap="round" fill="none" />
              <path d="M60 64 Q55 61 51 57" stroke={A.top} strokeWidth={8} strokeLinecap="round" fill="none" />
              <circle cx={45} cy={37} r={4.5} fill={A.skin} />
            </g>

            <FriendHead cx={A.cx} skin={A.skin} head="cap" headColor="#1c2733" />
            <FriendHead cx={B.cx} skin={B.skin} head="gele" headColor="#d6336c" />
          </g>
        </g>
        <g transform="translate(100 12) scale(0.6)">
          <polygon className="nrpg-pulse" points="0,-12 3.5,-4.5 12,-3.5 5.8,2 7.5,10.5 0,6.3 -7.5,10.5 -5.8,2 -12,-3.5 -3.5,-4.5" fill="#ffc233" />
        </g>
      </svg>
    </>
  );
}

/** Stage that sits on top of a mode card. `mode` is the MODE_CARDS mode. */
export function ModeArt({ mode }: { mode: string }) {
  const art = 'relative mx-auto block h-24 w-full sm:h-28';
  return (
    <div className="sim-sky relative overflow-hidden">
      <div className="bg-ankara mask-fade-down pointer-events-none absolute inset-0 opacity-[0.07]" />
      {/* full-width ground so the floor runs edge to edge whatever the card width */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[9.2%]" style={{ background: FLOOR }} />
      {mode === 'coop' ? <FriendsArt className={art} /> : <FaceOffArt className={art} />}
    </div>
  );
}