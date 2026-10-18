import type { ActorSpec, Beat, StageScene } from './types';

/**
 * Scene -> stage. One entry per scene key of every scenario in naijarpg-server/src/content/scenarios.
 * Run `npm run stage:check` after adding or renaming scenes, so nothing is left without art.
 *
 * Stage is 600 x 220. x is the middle of an actor, feet stand on y = 182.
 * Keep the whole opening under ~1.8s: the round timer is already running while it plays.
 * Facing follows the beat: walkInR (arrives from the right) faces left, driveInL faces right, and so on.
 */

export const DEFAULT_SCALE = 1.1;

/** How long each beat lasts when an actor doesn't say. */
export const BEAT_SECONDS: Record<Beat, number> = {
  driveInL: 1.2,
  driveInR: 1.2,
  walkInL: 1.0,
  walkInR: 1.0,
  popIn: 0.35,
  fadeIn: 0.45,
  riseIn: 0.5,
  tossL: 0.7,
  driveOutL: 1.2,
  driveOutR: 1.2,
  walkOffL: 1.2,
  walkOffR: 1.2,
};

export const beatSeconds = (a: ActorSpec) => (a.beat ? (a.for ?? BEAT_SECONDS[a.beat]) : 0);

/** Seconds until everything in the opening has landed. Loops (crossL / crossR) don't count. */
export function enterSeconds(s: StageScene): number {
  return s.cast.reduce((m, a) => (a.beat ? Math.max(m, (a.at ?? 0) + beatSeconds(a)) : m), 0);
}

const a = (art: ActorSpec['art'], x: number, o: Omit<ActorSpec, 'art' | 'x'> = {}): ActorSpec => ({ art, x, ...o });

/* ------------------------------------------------------------------ */
/*  Go-Slow Levy: Airport Road, 6:30pm, Uncle Chuks lands at 8         */
/* ------------------------------------------------------------------ */

const AGBERO_WINDOW: Record<string, StageScene> = {
  // the Bolt rolls in and stops in the go-slow, then the agbero walks up and knocks
  knock: {
    set: 'goSlow',
    cast: [
      a('bolt', 210, { beat: 'driveInL', for: 1.2 }),
      a('agbero', 350, { beat: 'walkInR', at: 0.45, for: 0.9, pose: 'stand', reach: 'front' }),
      a('alert', 350, { beat: 'popIn', at: 1.3 }),
    ],
  },
  kayode_talk: {
    set: 'goSlow',
    cast: [
      a('bolt', 210, { idle: 'rumble' }),
      a('kayode', 330, { beat: 'popIn', at: 0.1, pose: 'stand', reach: 'front', flip: true, idle: 'sway' }),
    ],
  },
  second_boy: {
    set: 'goSlow',
    cast: [
      a('bolt', 210, { idle: 'rumble' }),
      a('kayode', 320, { pose: 'stand', flip: true }),
      a('bigBoy', 400, { beat: 'walkInR', for: 0.9, pose: 'stand', reach: 'front' }),
      a('boyA', 105, { beat: 'walkInL', at: 0.25, for: 1.0, pose: 'stand' }),
      a('boyB', 150, { beat: 'walkInL', at: 0.4, for: 1.0, pose: 'stand' }),
    ],
  },
  viral: {
    set: 'goSlow',
    cast: [
      a('bolt', 210, { idle: 'rumble' }),
      a('kayode', 330, { pose: 'stand', flip: true, idle: 'hop' }),
      a('hawker', 470, { beat: 'walkInR', for: 1.0, pose: 'stand' }),
      a('whiteShirt', 410, { beat: 'walkInR', at: 0.2, for: 0.9, pose: 'stand', reach: 'front' }),
      a('bystanderM', 70, { beat: 'walkInL', at: 0.1, for: 1.0, pose: 'stand' }),
      a('phone', 70, { beat: 'popIn', at: 1.0 }),
      a('bystanderF', 540, { beat: 'walkInR', at: 0.3, for: 1.0, pose: 'stand' }),
      a('phone', 540, { beat: 'popIn', at: 1.15, flip: true }),
    ],
  },
  femi_gist: {
    set: 'goSlow',
    cast: [
      a('bolt', 210, { idle: 'rumble' }),
      // Kayode gives up and drifts off, and Mr. Femi finally speaks
      a('kayode', 330, { beat: 'walkOffR', at: 0.1, for: 1.3, pose: 'stand' }),
    ],
  },
  banging: {
    set: 'goSlow',
    cast: [
      a('bolt', 210, { idle: 'rumble' }),
      a('kayode', 330, { pose: 'stand', flip: true, reach: 'front' }),
      a('bigBoy', 400, { beat: 'walkInR', at: 0.1, for: 0.8, pose: 'stand', reach: 'front' }),
      a('boyA', 120, { beat: 'walkInL', at: 0.2, for: 0.9, pose: 'stand', reach: 'front' }),
      a('boyB', 470, { beat: 'walkInR', at: 0.3, for: 0.9, pose: 'stand' }),
      a('alert', 330, { beat: 'popIn', at: 0.9 }),
    ],
  },
  // the back road: the Bolt rolls up to a chained gate
  estate_gate: {
    set: 'estateGate',
    cast: [
      a('bolt', 170, { beat: 'driveInL', for: 1.2 }),
      a('guard', 360, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true }),
      a('guardB', 410, { beat: 'popIn', at: 0.95, pose: 'stand', flip: true, reach: 'front' }),
      a('boyC', 320, { beat: 'popIn', at: 1.1, pose: 'stand', flip: true }),
    ],
  },
  // fast along the service lane, then a LASTMA officer jumps out in front
  service_lane: {
    set: 'serviceLane',
    cast: [
      a('cones', 500),
      a('bolt', 200, { beat: 'driveInL', for: 1.0 }),
      a('lastma', 350, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true, reach: 'front' }),
      a('alert', 350, { beat: 'popIn', at: 1.0 }),
    ],
  },
  // an SUV cuts the road in front of the Bolt and the Chairman steps out
  chairman: {
    set: 'goSlow',
    cast: [
      a('bolt', 130, { idle: 'rumble' }),
      a('suv', 420, { beat: 'driveInR', for: 1.1 }),
      a('chairman', 310, { beat: 'popIn', at: 1.0, pose: 'stand', flip: true, idle: 'sway' }),
      a('kayode', 360, { beat: 'popIn', at: 1.15, pose: 'stand', flip: true }),
      a('bigBoy', 390, { beat: 'popIn', at: 1.25, pose: 'stand', flip: true }),
    ],
  },
  // Mr. Femi drops you at the bus stop and drives off; okada men crowd in
  okada: {
    set: 'busStop',
    cast: [
      a('bolt', 300, { beat: 'driveOutR', at: 0.1, for: 1.3 }),
      a('you', 440, { pose: 'stand', flip: true }),
      a('okada', 130, { beat: 'driveInL', at: 0.3, for: 1.0 }),
      a('okada', 215, { beat: 'driveInL', at: 0.5, for: 1.0 }),
    ],
  },
  // phone rings at the bus stop and a plane crosses the sky
  uncle_call: {
    set: 'busStop',
    cast: [
      a('plane', 120, { y: 58, idle: 'crossR', idleFor: 16 }),
      a('you', 300, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
      a('phone', 300, { beat: 'popIn', at: 1.0 }),
      a('alert', 300, { beat: 'popIn', at: 1.15 }),
    ],
  },
  arrivals_clean: {
    set: 'arrivals',
    cast: [
      a('trolley', 395),
      a('uncle', 340, { beat: 'popIn', at: 0.7, pose: 'stand', flip: true, reach: 'front' }),
      a('you', 150, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
      a('bystanderF', 500, { beat: 'fadeIn', at: 0.4, pose: 'stand', flip: true }),
    ],
  },
  arrivals_late: {
    set: 'arrivals',
    cast: [
      a('box', 390),
      a('uncle', 340, { beat: 'popIn', at: 0.7, pose: 'stand', flip: true }),
      a('puff', 340, { beat: 'fadeIn', at: 1.0 }),
      a('you', 150, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
      a('bystanderM', 480, { beat: 'fadeIn', at: 0.5, pose: 'stand', flip: true }),
    ],
  },
  arrivals_wahala: {
    set: 'arrivals',
    cast: [
      a('trolley', 395),
      a('uncle', 340, { beat: 'popIn', at: 0.6, pose: 'stand', flip: true, reach: 'front' }),
      a('stranger', 530, { beat: 'riseIn', at: 0.8, for: 0.6, pose: 'stand', flip: true }),
      a('you', 150, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
      a('alert', 150, { beat: 'popIn', at: 1.3 }),
    ],
  },
  // the car bounces down a muddy track to a keke blocking the gap in the wall
  muddy_shortcut: {
    set: 'estateGate',
    cast: [
      a('bolt', 150, { beat: 'driveInL', for: 1.2 }),
      a('keke', 420, { flip: true, idle: 'rumble' }),
      a('kekeRider', 395, { beat: 'popIn', at: 0.9, pose: 'stand', flip: true }),
      a('zzz', 395, { beat: 'fadeIn', at: 1.1 }),
    ],
  },
  // the road opens up, then a LASTMA officer waves the Bolt to the side
  airport_road: {
    set: 'serviceLane',
    cast: [
      a('bolt', 200, { beat: 'driveInL', for: 1.0 }),
      a('lastma', 350, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true, reach: 'front' }),
      a('lastma', 410, { beat: 'popIn', at: 0.95, pose: 'stand', flip: true }),
      a('alert', 350, { beat: 'popIn', at: 1.1 }),
    ],
  },
  // two flights landed, Uncle Chuks is somewhere in the crowd
  arrivals: {
    set: 'arrivals',
    cast: [
      a('trolley', 395),
      a('uncle', 340, { beat: 'popIn', at: 0.7, pose: 'stand', flip: true }),
      a('bystanderM', 470, { beat: 'fadeIn', at: 0.4, pose: 'stand', flip: true }),
      a('bystanderF', 245, { beat: 'fadeIn', at: 0.5, pose: 'stand' }),
      a('you', 150, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Night Don Fall: last danfo, 10:40pm, twenty minutes on foot        */
/* ------------------------------------------------------------------ */

const NIGHT_RETURN: Record<string, StageScene> = {
  // the danfo pulls away and you are left at the junction with a keke idling
  junction: {
    set: 'junction',
    cast: [
      a('danfo', 300, { beat: 'driveOutR', at: 0.1, for: 1.5 }),
      a('keke', 480, { flip: true, idle: 'rumble' }),
      a('you', 190, { beat: 'popIn', at: 0.1, pose: 'stand' }),
      a('rival', 250, { beat: 'popIn', at: 0.25, pose: 'stand', duo: true }),
    ],
  },

  /* ---- first move: what happened at the junction ---- */
  // won the keke: rider is awake and the engine is running
  keke_ride: {
    set: 'junction',
    cast: [
      a('keke', 480, { flip: true, idle: 'rumble' }),
      a('kekeRider', 405, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true }),
      a('you', 260, { beat: 'walkInL', for: 0.9, pose: 'stand' }),
    ],
  },
  // lost the keke: tail light leaves, an okada slows down beside you
  keke_gone: {
    set: 'junction',
    cast: [
      a('keke', 300, { beat: 'driveOutR', at: 0.1, for: 1.4 }),
      a('you', 250, { beat: 'popIn', at: 0.1, pose: 'stand' }),
      a('okada', 520, { flip: true, beat: 'driveInR', at: 0.8, for: 0.9 }),
      a('alert', 250, { beat: 'popIn', at: 1.4 }),
    ],
  },
  // main road, nobody has noticed you yet
  road_clear: {
    set: 'mainRoad',
    cast: [
      a('you', 200, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
      a('thug', 490, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true }),
      a('thugB', 545, { beat: 'popIn', at: 1.0, pose: 'stand', flip: true }),
    ],
  },
  // you tripped, the phone is in the weeds and the boys heard it
  road_snag: {
    set: 'mainRoad',
    cast: [
      a('you', 190, { beat: 'popIn', at: 0.1, pose: 'stand' }),
      a('phone', 255, { beat: 'popIn', at: 0.3 }),
      a('thug', 470, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true }),
      a('thugB', 530, { beat: 'popIn', at: 1.0, pose: 'stand', flip: true }),
      a('alert', 470, { beat: 'popIn', at: 1.3 }),
    ],
  },
  // the fake call lands and three guys go quiet
  call_works: {
    set: 'barStreet',
    cast: [
      a('you', 190, { beat: 'walkInL', for: 0.9, pose: 'stand' }),
      a('phone', 190, { beat: 'popIn', at: 0.6 }),
      a('boyA', 400, { beat: 'popIn', at: 0.6, pose: 'stand', flip: true }),
      a('boyB', 455, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true }),
      a('boyC', 510, { beat: 'popIn', at: 1.0, pose: 'stand', flip: true }),
    ],
  },
  // the fake call is caught
  call_exposed: {
    set: 'barStreet',
    cast: [
      a('you', 190, { beat: 'walkInL', for: 0.9, pose: 'stand' }),
      a('phone', 190, { beat: 'popIn', at: 0.6 }),
      a('thug', 370, { beat: 'popIn', at: 0.6, pose: 'guard', flip: true }),
      a('thugB', 435, { beat: 'popIn', at: 0.8, pose: 'guard', flip: true }),
      a('boyA', 500, { beat: 'popIn', at: 1.0, pose: 'stand', flip: true }),
      a('torch', 370, { beat: 'fadeIn', at: 0.9, for: 0.25 }),
      a('alert', 190, { beat: 'popIn', at: 1.3 }),
    ],
  },
  // inner street: people out, corn on the coals, draughts under a bulb
  corn_aunty: {
    set: 'innerStreet',
    cast: [
      a('generator', 545, { idle: 'rumble' }),
      a('akaraWoman', 420, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true }),
      a('bystanderM', 320, { beat: 'popIn', at: 0.6, pose: 'stand' }),
      a('you', 170, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  // burial canopy across the whole street
  street_blocked: {
    set: 'generatorRow',
    cast: [
      a('generator', 55, { idle: 'rumble' }),
      a('generator', 565, { idle: 'rumble' }),
      a('bystanderM', 150, { beat: 'popIn', at: 0.6, pose: 'stand' }),
      a('bystanderF', 450, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true }),
      a('guard', 510, { beat: 'popIn', at: 1.0, pose: 'stand', flip: true }),
      a('you', 300, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
      a('alert', 300, { beat: 'popIn', at: 1.25 }),
    ],
  },

  /* ---- the bridge, the post, the lane ---- */
  // boys on the railings, Ajala comes down to name the price
  bridge_toll: {
    set: 'barStreet',
    cast: [
      a('you', 170, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
      a('thug', 380, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('thugB', 445, { beat: 'popIn', at: 0.7, pose: 'stand', flip: true }),
      a('boyA', 505, { beat: 'popIn', at: 0.9, pose: 'stand', flip: true }),
    ],
  },
  // they are off the railing and in a half circle, one with a plank
  bridge_heated: {
    set: 'barStreet',
    cast: [
      a('you', 170, { beat: 'popIn', at: 0.1, pose: 'stand' }),
      a('thug', 330, { beat: 'popIn', at: 0.3, pose: 'guard', flip: true }),
      a('thugB', 395, { beat: 'popIn', at: 0.5, pose: 'guard', flip: true }),
      a('boyA', 460, { beat: 'popIn', at: 0.7, pose: 'guard', flip: true }),
      a('stick', 358, { beat: 'popIn', at: 0.8, flip: true }),
      a('alert', 170, { beat: 'popIn', at: 1.1 }),
    ],
  },
  vigilante_post: {
    set: 'innerStreet',
    cast: [
      a('you', 190, { beat: 'walkInL', for: 0.9, pose: 'stand' }),
      a('vigilante', 335, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('torch', 335, { beat: 'fadeIn', at: 0.55, for: 0.25 }),
      a('vigilante', 375, { beat: 'popIn', at: 0.65, pose: 'stand', flip: true }),
      a('vigilante', 415, { beat: 'popIn', at: 0.8, pose: 'stand', flip: true, reach: 'front' }),
      a('stick', 392, { beat: 'popIn', at: 0.8, flip: true }),
      a('alert', 190, { beat: 'popIn', at: 1.1 }),
    ],
  },
  // dark lane, one man smoking outside his gate
  back_lane: {
    set: 'innerStreet',
    cast: [
      a('you', 150, { beat: 'walkInL', for: 1.2, pose: 'stand' }),
      a('stranger', 450, { beat: 'popIn', at: 0.9, pose: 'stand', flip: true }),
      a('puff', 430, { beat: 'fadeIn', at: 1.1, for: 0.3 }),
      a('alert', 150, { beat: 'popIn', at: 1.4 }),
    ],
  },

  /* ---- your gate, five ways ---- */
  gate_clean: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('you', 250, { beat: 'walkInL', for: 1.3, pose: 'stand', idle: 'heave' }),
    ],
  },
  gate_shaken: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('gateman', 400, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('zzz', 400, { beat: 'fadeIn', at: 0.8 }),
      a('you', 240, { beat: 'walkInL', for: 1.1, pose: 'stand', idle: 'heave' }),
    ],
  },
  gate_followed: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('gateman', 410, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true }),
      a('stranger', 105, { y: 178, scale: 1, beat: 'walkInL', at: 0.5, for: 1.1, pose: 'stand' }),
      a('you', 300, { beat: 'walkInL', for: 1.1, pose: 'stand' }),
      a('alert', 300, { beat: 'popIn', at: 1.3 }),
    ],
  },
  // no phone, no money, Mallam slides the bolt
  gate_robbed: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('gateman', 410, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('you', 240, { beat: 'walkInL', for: 1.1, pose: 'stand', idle: 'heave' }),
      a('alert', 240, { beat: 'popIn', at: 1.3 }),
    ],
  },
  // vigilante men stand off with their lamps while Mallam looks them over
  gate_escorted: {
    set: 'gate',
    cast: [
      a('generator', 540, { idle: 'rumble' }),
      a('gateman', 440, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('vigilante', 90, { beat: 'popIn', at: 0.3, pose: 'stand' }),
      a('lantern', 90, { beat: 'fadeIn', at: 0.4, for: 0.25 }),
      a('vigilante', 160, { beat: 'popIn', at: 0.5, pose: 'stand' }),
      a('you', 290, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  // your street, the gate in sight
  home_stretch: {
    set: 'innerStreet',
    cast: [
      a('generator', 545, { idle: 'rumble' }),
      a('you', 170, { beat: 'walkInL', for: 1.3, pose: 'stand', idle: 'heave' }),
      a('phone', 170, { beat: 'popIn', at: 1.0 }),
    ],
  },
  // phone and money gone, the boys walk off with them
  mugged: {
    set: 'barStreet',
    cast: [
      a('you', 190, { beat: 'popIn', at: 0.1, pose: 'stand' }),
      a('thug', 330, { beat: 'walkOffR', at: 0.3, for: 1.3, pose: 'stand' }),
      a('thugB', 380, { beat: 'walkOffR', at: 0.45, for: 1.3, pose: 'stand' }),
      a('alert', 190, { beat: 'popIn', at: 1.0 }),
    ],
  },
  home_safe: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('gateman', 410, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('you', 250, { beat: 'walkInL', for: 1.3, pose: 'stand', idle: 'heave' }),
      a('phone', 250, { beat: 'popIn', at: 1.3 }),
    ],
  },
  home_battered: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('gateman', 410, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('you', 240, { beat: 'walkInL', for: 1.2, pose: 'stand', idle: 'heave' }),
      a('phone', 240, { beat: 'popIn', at: 1.3 }),
    ],
  },
  home_robbed: {
    set: 'gate',
    cast: [
      a('generator', 520, { idle: 'rumble' }),
      a('gateman', 410, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('you', 240, { beat: 'walkInL', for: 1.2, pose: 'stand', idle: 'heave' }),
      a('alert', 240, { beat: 'popIn', at: 1.3 }),
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Oga at the Top: Abuja, one interview, a letter nobody respects      */
/* ------------------------------------------------------------------ */

const OGA_AT_THE_TOP: Record<string, StageScene> = {
  // 7am, the phone buzzes in a dark room
  morning_panic: {
    set: 'bedroom',
    cast: [a('you', 300, { beat: 'popIn', at: 0.2, pose: 'stand' }), a('phone', 300, { beat: 'popIn', at: 0.6 }), a('alert', 300, { beat: 'popIn', at: 1.0 })],
  },
  sister_network: {
    set: 'bedroom',
    cast: [a('you', 300, { pose: 'stand' }), a('phone', 300, { beat: 'popIn', at: 0.3 })],
  },
  new_oga_gist: {
    set: 'bedroom',
    cast: [a('you', 300, { pose: 'stand' }), a('phone', 300, { beat: 'popIn', at: 0.3 }), a('puff', 330, { beat: 'fadeIn', at: 0.7 })],
  },
  taxi_park: {
    set: 'busStop',
    cast: [
      a('okada', 130, { beat: 'driveInL', at: 0.2, for: 1.0 }),
      a('akaraWoman', 440, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true }),
      a('conductor', 360, { beat: 'popIn', at: 0.6, pose: 'stand', flip: true, reach: 'front' }),
      a('you', 200, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  ministry_gate: {
    set: 'ministry',
    cast: [
      a('guard', 440, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true, reach: 'front' }),
      a('you', 190, { beat: 'walkInL', for: 1.1, pose: 'stand' }),
      a('alert', 190, { beat: 'popIn', at: 1.3 }),
    ],
  },
  // the old oga's driver gave you wrong information, the Prado is right there
  driver_bust: {
    set: 'ministry',
    cast: [
      a('suv', 300, { flip: true, idle: 'rumble' }),
      a('musa', 400, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('you', 160, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
      a('alert', 160, { beat: 'popIn', at: 1.3 }),
    ],
  },
  driver_shed: {
    set: 'ministry',
    cast: [
      a('musa', 400, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true }),
      a('boyA', 470, { beat: 'popIn', at: 0.6, pose: 'stand', flip: true }),
      a('boyB', 520, { beat: 'popIn', at: 0.7, pose: 'stand', flip: true }),
      a('you', 190, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  security_wahala: {
    set: 'office',
    cast: [
      a('supervisor', 320, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true, reach: 'front' }),
      a('you', 180, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
      a('alert', 180, { beat: 'popIn', at: 1.3 }),
    ],
  },
  secretary_office: {
    set: 'office',
    cast: [
      a('grace', 300, { beat: 'popIn', at: 0.4, pose: 'stand' }),
      a('bystanderM', 520, { beat: 'fadeIn', at: 0.6, pose: 'stand', flip: true }),
      a('you', 160, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  wrong_office: {
    set: 'office',
    cast: [a('you', 200, { beat: 'walkInL', for: 1.1, pose: 'stand' }), a('puff', 340, { beat: 'fadeIn', at: 0.8 }), a('alert', 200, { beat: 'popIn', at: 1.3 })],
  },
  lobby_wait: {
    set: 'office',
    cast: [
      a('grace', 300, { beat: 'popIn', at: 0.3, pose: 'stand' }),
      a('bystanderM', 500, { beat: 'fadeIn', at: 0.5, pose: 'stand', flip: true }),
      a('bystanderF', 560, { beat: 'fadeIn', at: 0.6, pose: 'stand', flip: true }),
      a('you', 160, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  interview_room: {
    set: 'office',
    cast: [
      a('sule', 300, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true, reach: 'front' }),
      a('you', 170, { beat: 'walkInL', for: 1.0, pose: 'stand' }),
    ],
  },
  oga_house: {
    set: 'compound',
    cast: [
      a('gateman', 380, { beat: 'popIn', at: 0.5, pose: 'stand', flip: true }),
      a('sule', 440, { beat: 'popIn', at: 0.9, pose: 'stand', flip: true }),
      a('you', 180, { beat: 'walkInL', for: 1.1, pose: 'stand' }),
    ],
  },
  interview_success: {
    set: 'office',
    cast: [
      a('sule', 300, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true, reach: 'front' }),
      a('you', 190, { beat: 'walkInL', for: 1.0, pose: 'stand', reach: 'front' }),
    ],
  },
  interview_fail: {
    set: 'ministry',
    cast: [a('you', 330, { beat: 'walkOffR', at: 0.2, for: 1.6, pose: 'stand' }), a('guard', 440, { beat: 'popIn', at: 0.3, pose: 'stand', flip: true }), a('puff', 330, { beat: 'fadeIn', at: 0.6 })],
  },
  interview_waitlist: {
    set: 'office',
    cast: [a('sule', 300, { beat: 'popIn', at: 0.4, pose: 'stand', flip: true }), a('box', 330, { beat: 'popIn', at: 0.8 }), a('you', 170, { beat: 'walkInL', for: 1.0, pose: 'stand' })],
  },
};

export const STAGES: Record<string, Record<string, StageScene>> = {
  'agbero-window': AGBERO_WINDOW,
  'night-return': NIGHT_RETURN,
  'oga-at-the-top': OGA_AT_THE_TOP,
};

/** Shown for any scene that has no entry yet, so a new scenario never breaks the page. */
const FALLBACK: StageScene = {
  set: 'junction',
  cast: [a('you', 220, { beat: 'walkInL', for: 1.0, pose: 'stand' })],
};

export function resolveStage(scenarioId: string, sceneKey: string | undefined): { stage: StageScene; known: boolean } {
  const s = sceneKey ? STAGES[scenarioId]?.[sceneKey] : undefined;
  if (!s && sceneKey && process.env.NODE_ENV !== 'production') {
    console.warn(`[stage] no stage for ${scenarioId}/${sceneKey}, using fallback`);
  }
  return { stage: s ?? FALLBACK, known: !!s };
}