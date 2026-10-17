import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CarRow, DUSK, GROUND, Lamp, NIGHT, Palm, Road, Shops, Sign, Skyline, Sky, House, Wall, W, H } from './scenery';
import type { SetId } from './types';

/**
 * Backdrops. Each one is a short composition of the pieces in scenery.tsx.
 * Nothing here moves except small ambient pulses (brake lights, lamps, neon), so the actors stay the focus.
 */
type SetProps = { uid: string };

/* ---------------------------- Go-Slow Levy (dusk) ---------------------------- */

function GoSlow({ uid }: SetProps) {
  const m = DUSK;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={140} />
      {/* flyover */}
      <rect x={0} y={118} width={W} height={9} fill="#0f1b16" />
      {[60, 190, 330, 470].map((x) => (
        <rect key={x} x={x} y={127} width={9} height={38} fill="#0f1b16" />
      ))}
      <Sign x={400} y={96} w={96} text="AIRPORT RD →" bg="#0e5a3a" color="#f4f8f5" />
      <Palm x={46} />
      <Lamp x={500} mood={m} />
      <Road mood={m} top={160} />
      {/* the go-slow: a column of cars waiting, brake lights pulsing */}
      <CarRow y={172} xs={[40, 150, 470, 560]} mood={m} scale={0.62} />
      <CarRow y={166} xs={[96, 250, 360, 520]} mood={m} scale={0.42} />
    </>
  );
}

function ServiceLane({ uid }: SetProps) {
  const m = DUSK;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={136} />
      <House x={20} w={96} h={44} base={150} mood={m} windows={3} />
      <House x={470} w={96} h={50} base={150} mood={m} windows={3} />
      <Sign x={226} y={88} w={104} text="SERVICE LANE" bg="#1b3a5a" color="#f4f8f5" />
      <rect x={276} y={103} width={4} height={47} fill="#0a1310" />
      <Lamp x={410} mood={m} />
      {/* the main road behind the divider, slow and full */}
      <Road mood={m} top={150} dashed={false} />
      <rect x={0} y={150} width={W} height={7} fill="#2a3a33" />
      <CarRow y={154} xs={[60, 140, 220, 400, 480, 560]} mood={m} scale={0.36} />
      <rect y={172} width={W} height={H - 172} fill="#101a16" />
      <line x1={0} y1={196} x2={W} y2={196} stroke={m.line} strokeOpacity={0.3} strokeWidth={2.5} strokeDasharray="30 24" />
    </>
  );
}

function EstateGate({ uid }: SetProps) {
  const m = DUSK;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={130} lit={false} />
      <Palm x={40} />
      <Palm x={560} />
      <Wall x={0} w={190} h={52} base={168} />
      <Wall x={410} w={190} h={52} base={168} />
      <Sign x={226} y={84} w={148} text="AJAO ESTATE" bg="#0e3a5a" color="#f4f8f5" />
      {/* pillars, the chained gate and a guard hut */}
      <rect x={190} y={96} width={14} height={72} fill="#34463d" />
      <rect x={396} y={96} width={14} height={72} fill="#34463d" />
      <g stroke="#0a1310" strokeWidth={3}>
        {[214, 232, 250, 268, 286, 304, 322, 340, 358, 376].map((x) => (
          <line key={x} x1={x} y1={168} x2={x} y2={112} />
        ))}
        <line x1={204} y1={124} x2={396} y2={124} />
        <line x1={204} y1={156} x2={396} y2={156} />
      </g>
      <path d="M290 136 q10 8 20 0" stroke="#9aa5a0" strokeWidth={3} fill="none" />
      <rect x={452} y={116} width={44} height={52} fill="#2d3f36" />
      <rect x={458} y={124} width={32} height={18} fill="#ffcf70" opacity={0.4} />
      <Lamp x={150} mood={m} />
      <rect y={168} width={W} height={H - 168} fill={m.road} />
      <rect y={168} width={W} height={6} fill={m.curb} />
    </>
  );
}

function BusStop({ uid }: SetProps) {
  const m = DUSK;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={144} />
      <Palm x={560} />
      <Lamp x={60} mood={m} />
      {/* shelter */}
      <rect x={380} y={104} width={120} height={5} rx={2} fill="#0f1b16" />
      <rect x={384} y={109} width={4} height={59} fill="#0f1b16" />
      <rect x={494} y={109} width={4} height={59} fill="#0f1b16" />
      <rect x={392} y={134} width={96} height={5} fill="#34463d" />
      <Sign x={402} y={86} w={76} text="BUS STOP" bg="#c9473f" color="#f4f8f5" />
      <Road mood={m} top={164} />
      <CarRow y={160} xs={[120, 230, 330]} mood={m} scale={0.36} />
    </>
  );
}

function Arrivals({ uid }: SetProps) {
  const warm = '#f1e0b8';
  return (
    <>
      <defs>
        <linearGradient id={uid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#24362f" />
          <stop offset="1" stopColor="#35493f" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid})`} />
      {/* ceiling lights */}
      {[60, 180, 300, 420, 540].map((x) => (
        <rect key={x} x={x - 26} y={10} width={52} height={5} rx={2} fill={warm} opacity={0.75} className="stg-glow" />
      ))}
      <Sign x={220} y={26} w={160} text="ARRIVALS" bg="#0e3a5a" color="#f4f8f5" />
      {/* sliding doors, left */}
      <rect x={14} y={60} width={104} height={108} fill="#12201b" />
      <rect x={20} y={66} width={44} height={102} fill="#9fd8ff" opacity={0.18} />
      <rect x={68} y={66} width={44} height={102} fill="#9fd8ff" opacity={0.18} />
      {/* pillar */}
      <rect x={300} y={52} width={36} height={116} fill="#44584d" />
      <rect x={300} y={52} width={36} height={6} fill="#566a5e" />
      {/* barrier and rail */}
      <rect x={430} y={132} width={150} height={5} fill="#9aa5a0" />
      {[440, 490, 540, 580].map((x) => (
        <rect key={x} x={x} y={132} width={4} height={36} fill="#9aa5a0" />
      ))}
      <rect y={168} width={W} height={H - 168} fill="#2c3d35" />
      <rect y={168} width={W} height={4} fill="#3a4e44" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={i * 90} y1={172} x2={i * 90 - 30} y2={H} stroke="#3a4e44" strokeWidth={1} opacity={0.6} />
      ))}
    </>
  );
}

/* ---------------------------- Night Don Fall ---------------------------- */

function Junction({ uid }: SetProps) {
  const m = NIGHT;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={140} lit={false} />
      <Shops x={14} n={3} base={168} mood={m} />
      <Shops x={430} n={2} base={168} mood={m} />
      {/* the street light is off, again */}
      <Lamp x={300} lit={false} mood={m} />
      <Sign x={226} y={110} w={64} text="BUS STOP" bg="#2a1614" color="#a3584f" />
      <Road mood={m} top={164} />
    </>
  );
}

function MainRoad({ uid }: SetProps) {
  const m = NIGHT;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={142} lit={false} />
      {/* a small fire far down the road */}
      <circle cx={470} cy={150} r={38} fill="#e38b3f" opacity={0.16} className="stg-flicker" />
      <g className="stg-flicker">
        <path d="M466 160 q4 -14 8 0 q3 -8 6 0 z" fill="#ff9a3c" />
        <path d="M470 160 q2 -8 5 0 z" fill="#ffd27a" />
      </g>
      <Shops x={10} n={3} base={166} mood={m} />
      {/* power poles */}
      {[210, 360].map((x) => (
        <g key={x}>
          <rect x={x} y={70} width={4} height={96} fill="#0a1310" />
          <rect x={x - 12} y={78} width={28} height={3} fill="#0a1310" />
        </g>
      ))}
      <path d="M198 80 Q282 96 364 80 M214 80 Q297 96 380 80" stroke="#0a1310" strokeWidth={1.2} fill="none" />
      <Road mood={m} top={164} />
    </>
  );
}

function InnerStreet({ uid }: SetProps) {
  const m = NIGHT;
  return (
    <>
      <Sky id={uid} mood={m} />
      <House x={-10} w={150} h={64} base={170} mood={m} windows={4} fill="#142720" />
      <House x={460} w={150} h={70} base={170} mood={m} windows={4} fill="#142720" />
      <House x={150} w={110} h={44} base={162} mood={m} windows={2} fill="#0e1c17" />
      <House x={340} w={110} h={48} base={162} mood={m} windows={2} fill="#0e1c17" />
      {/* plastic chairs outside a shut shop */}
      {[372, 398, 424].map((x) => (
        <g key={x}>
          <rect x={x} y={150} width={14} height={4} rx={1.5} fill="#e8efe9" opacity={0.7} />
          <rect x={x} y={138} width={3} height={14} fill="#e8efe9" opacity={0.7} />
          <rect x={x + 1} y={154} width={2} height={14} fill="#e8efe9" opacity={0.5} />
          <rect x={x + 11} y={154} width={2} height={14} fill="#e8efe9" opacity={0.5} />
        </g>
      ))}
      <rect y={170} width={W} height={H - 170} fill={m.road} />
      <rect y={170} width={W} height={5} fill={m.curb} />
    </>
  );
}

function GeneratorRow({ uid }: SetProps) {
  const m = NIGHT;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Wall x={0} w={W} h={70} base={168} fill="#16261f" />
      {[40, 150, 260, 370, 480].map((x, i) => (
        <g key={x}>
          <rect x={x} y={102} width={46} height={66} fill="#0e1c17" />
          <rect x={x + 8} y={112} width={14} height={16} fill={m.window} opacity={0.5} className="stg-flicker" style={{ '--fd': `${i * 0.4}s` } as CSSProperties} />
        </g>
      ))}
      <g opacity={0.5}>
        {[96, 206, 316, 426, 536].map((x) => (
          <circle key={x} cx={x} cy={150} r={26} fill={m.window} opacity={0.12} />
        ))}
      </g>
      <rect y={168} width={W} height={H - 168} fill={m.road} />
      <rect y={168} width={W} height={5} fill={m.curb} />
    </>
  );
}

function BarStreet({ uid }: SetProps) {
  const m = NIGHT;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={140} lit={false} />
      {/* the bar, lit up and loud */}
      <rect x={40} y={92} width={210} height={76} fill="#1a1f2a" />
      <rect x={52} y={118} width={186} height={50} fill="#ffcf70" opacity={0.28} />
      <circle cx={145} cy={140} r={90} fill="#ff4f8b" opacity={0.08} className="stg-neon" />
      <Sign x={92} y={98} w={106} text="BLUE NOTE BAR" bg="#12161f" color="#ff5fa2" className="stg-neon" />
      {[64, 112, 160, 208].map((x) => (
        <rect key={x} x={x} y={132} width={22} height={36} fill="#0a1310" opacity={0.6} />
      ))}
      <Shops x={440} n={2} base={168} mood={m} />
      <Road mood={m} top={164} />
    </>
  );
}

function Gate({ uid }: SetProps) {
  const m = NIGHT;
  return (
    <>
      <Sky id={uid} mood={m} />
      <Skyline mood={m} base={120} lit={false} />
      <Wall x={0} w={W} h={86} base={168} fill="#16261f" />
      <rect x={0} y={82} width={W} height={4} fill="#223a30" />
      {/* the gate, lit by the neighbour's generator */}
      <circle cx={300} cy={130} r={110} fill={m.window} opacity={0.1} className="stg-glow" />
      <rect x={236} y={96} width={128} height={72} fill="#1d2d27" />
      <g stroke="#0a1310" strokeWidth={4}>
        <line x1={300} y1={96} x2={300} y2={168} />
        <line x1={236} y1={132} x2={364} y2={132} />
      </g>
      <rect x={230} y={92} width={6} height={76} fill="#34463d" />
      <rect x={364} y={92} width={6} height={76} fill="#34463d" />
      <circle cx={300} cy={80} r={0.01} />
      <rect x={290} y={70} width={20} height={10} rx={3} fill="#fff3c4" opacity={0.85} className="stg-glow" />
      <rect y={168} width={W} height={H - 168} fill={m.road} />
      <rect y={168} width={W} height={5} fill={m.curb} />
    </>
  );
}

const SETS: Record<SetId, (p: SetProps) => ReactNode> = {
  goSlow: GoSlow,
  serviceLane: ServiceLane,
  estateGate: EstateGate,
  busStop: BusStop,
  arrivals: Arrivals,
  junction: Junction,
  mainRoad: MainRoad,
  innerStreet: InnerStreet,
  generatorRow: GeneratorRow,
  barStreet: BarStreet,
  gate: Gate,
};

export function Backdrop({ set }: { set: SetId }) {
  const uid = `stg${useId().replace(/:/g, '')}`;
  const Set = SETS[set] ?? SETS.junction;
  return <>{Set({ uid })}</>;
}

export { GROUND };
