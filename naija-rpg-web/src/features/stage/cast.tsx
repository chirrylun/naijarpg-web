import type { ReactNode } from 'react';
import { Person } from '../scene/People';
import type { PersonProps } from '../scene/People';
import { VEHICLES } from './vehicles';
import * as P from './props';
import type { ArtId, Pose, PropId, VehicleId } from './types';

/** Looks for everyone who can appear on the stage. Colours follow the landing street. */
export const PERSONS = {
  you: { skin: '#8a5a3c', top: '#1fc77e', bottom: '#26324f', head: 'cap', headColor: '#1c2733' },
  rival: { skin: '#a56b46', top: '#5cb8ff', bottom: '#1d2430', head: 'hair' },
  // roadside boys and officials
  agbero: { skin: '#7a4a30', top: '#c9b27a', bottom: '#2b2f3a', shoes: '#15191c', head: 'cap', headColor: '#3a3a2a' },
  kayode: { skin: '#a56b46', top: '#d9c27a', bottom: '#3a3f4d', shoes: '#e9e9e9', head: 'hair' },
  bigBoy: { skin: '#6b4128', top: '#c9473f', bottom: '#222a3a', shoes: '#15191c', head: 'cap', headColor: '#222a3a' },
  boyA: { skin: '#8a5a3c', top: '#e8efe9', bottom: '#2b2f3a', head: 'hair' },
  boyB: { skin: '#a56b46', top: '#3b6ea5', bottom: '#1d2430', head: 'cap', headColor: '#222222' },
  boyC: { skin: '#7a4a30', top: '#d9a21b', bottom: '#2b2f3a', head: 'hair' },
  chairman: { skin: '#6b4128', top: '#f1e6c9', bottom: '#d9a21b', shoes: '#15191c', head: 'cap', headColor: '#c9473f', dress: true },
  lastma: { skin: '#8a5a3c', top: '#1fae5a', bottom: '#2b2f3a', shoes: '#15191c', head: 'cap', headColor: '#1fae5a' },
  guard: { skin: '#6b4128', top: '#3b4a6b', bottom: '#22283a', shoes: '#15191c', head: 'cap', headColor: '#22283a' },
  guardB: { skin: '#8a5a3c', top: '#3b4a6b', bottom: '#22283a', shoes: '#15191c', head: 'cap', headColor: '#22283a' },
  vigilante: { skin: '#7a4a30', top: '#6b6a3a', bottom: '#2b2f3a', shoes: '#15191c', head: 'cap', headColor: '#4a4a2a' },
  gateman: { skin: '#6b4128', top: '#3b4a6b', bottom: '#22283a', shoes: '#15191c', head: 'cap', headColor: '#22283a' },
  // crowd
  hawker: { skin: '#6b4128', top: '#d9a21b', bottom: '#2a5c8a', head: 'bundle', headColor: '#2a5c8a', dress: true },
  whiteShirt: { skin: '#a56b46', top: '#e8efe9', bottom: '#222a3a', shoes: '#15191c', head: 'hair' },
  bystanderM: { skin: '#8a5a3c', top: '#c9473f', bottom: '#2b2f3a', head: 'cap', headColor: '#2b2f3a' },
  bystanderF: { skin: '#7a4a30', top: '#c9473f', bottom: '#ffc233', shoes: '#f0e6d2', head: 'gele', headColor: '#2a5c8a', dress: true },
  akaraWoman: { skin: '#7a4a30', top: '#e0892f', bottom: '#d6336c', shoes: '#f0e6d2', head: 'gele', headColor: '#d6336c', dress: true },
  conductor: { skin: '#8a5a3c', top: '#d9a21b', bottom: '#2b2f3a', head: 'cap', headColor: '#2b2f3a' },
  kekeRider: { skin: '#7a4a30', top: '#3b6ea5', bottom: '#1d2430', head: 'cap', headColor: '#1d2430' },
  // airport
  uncle: { skin: '#6b4128', top: '#2a5c8a', bottom: '#c9a45a', shoes: '#f5f5f5', head: 'hair' },
  // night
  thug: { skin: '#8a5a3c', top: '#2b2f3a', bottom: '#1d2430', shoes: '#15191c', head: 'hair' },
  thugB: { skin: '#6b4128', top: '#3a2f2f', bottom: '#1d2430', shoes: '#15191c', head: 'cap', headColor: '#1d2430' },
  stranger: { skin: '#7a4a30', top: '#1d2430', bottom: '#12161c', shoes: '#0d1013', head: 'cap', headColor: '#12161c' },
} satisfies Record<string, PersonProps>;

export type ArtCtx = {
  pose: Pose;
  reach?: 'front' | 'back';
  flip: boolean;
  /** drive / walk beat is playing right now */
  moving: boolean;
  step?: number;
};

const PROPS: Record<PropId, () => ReactNode> = {
  alert: P.Alert,
  phone: P.Phone,
  torch: P.Torch,
  lantern: P.Lantern,
  rope: P.Rope,
  box: P.Box,
  trolley: P.Trolley,
  stick: P.Stick,
  zzz: P.Zzz,
  puff: P.Puff,
  generator: P.Generator,
  plane: P.Plane,
  cones: P.Cones,
};

export function drawArt(art: ArtId, c: ArtCtx): ReactNode {
  if (art in PERSONS) {
    const look = PERSONS[art as keyof typeof PERSONS] as PersonProps;
    return <Person {...look} pose={c.pose} reach={c.reach} flip={c.flip} step={c.step ?? 0.7} />;
  }
  const flipG = c.flip ? 'scale(-1 1)' : undefined;
  if (art in VEHICLES) {
    const V = VEHICLES[art as VehicleId];
    return (
      <g transform={flipG}>
        <V moving={c.moving} />
      </g>
    );
  }
  const Pr = PROPS[art as PropId];
  return <g transform={flipG}>{Pr ? <Pr /> : null}</g>;
}
