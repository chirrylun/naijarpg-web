import type { PERSONS } from './cast';

/** Every backdrop the encounter stage can show. Add a new one in sets.tsx. */
export type SetId =
  // Go-Slow Levy (dusk)
  | 'goSlow'
  | 'serviceLane'
  | 'estateGate'
  | 'busStop'
  | 'arrivals'
  // Night Don Fall (night)
  | 'junction'
  | 'mainRoad'
  | 'innerStreet'
  | 'generatorRow'
  | 'barStreet'
  | 'gate';

export type PersonId = keyof typeof PERSONS;
export type VehicleId = 'bolt' | 'suv' | 'keke' | 'okada' | 'danfo';
export type PropId =
  | 'alert'
  | 'phone'
  | 'torch'
  | 'lantern'
  | 'rope'
  | 'box'
  | 'trolley'
  | 'stick'
  | 'zzz'
  | 'puff'
  | 'generator'
  | 'plane'
  | 'cones';
export type ArtId = PersonId | VehicleId | PropId;

/**
 * One-shot motion when a scene opens (`*In*`, `popIn`, `fadeIn`, `riseIn`, `tossL`)
 * or when something leaves (`*Off*`, `*Out*`). L / R is the side it comes from (In) or goes to (Out/Off).
 */
export type Beat =
  | 'driveInL'
  | 'driveInR'
  | 'walkInL'
  | 'walkInR'
  | 'popIn'
  | 'fadeIn'
  | 'riseIn'
  | 'tossL'
  | 'driveOutL'
  | 'driveOutR'
  | 'walkOffL'
  | 'walkOffR';

/** Quiet loops that run once the scene has settled. */
export type Idle = 'none' | 'hop' | 'float' | 'rumble' | 'heave' | 'sway' | 'crossL' | 'crossR';

export type Pose = 'walk' | 'guard' | 'stand';

export type ActorSpec = {
  art: ArtId;
  /** stage is 600 x 220; x is the middle of the actor */
  x: number;
  /** feet line, default 182. Smaller = further back */
  y?: number;
  scale?: number;
  /** override facing; by default it follows the beat's direction */
  flip?: boolean;
  /** final pose once the scene settles (people only) */
  pose?: Pose;
  reach?: 'front' | 'back';
  beat?: Beat;
  /** seconds after the scene starts */
  at?: number;
  /** seconds the beat lasts */
  for?: number;
  idle?: Idle;
  /** seconds per loop (crossL / crossR: seconds to cross the stage) */
  idleFor?: number;
  /** only draw when someone else is playing too (rival / partner) */
  duo?: boolean;
};

export type StageScene = {
  set: SetId;
  cast: ActorSpec[];
};
