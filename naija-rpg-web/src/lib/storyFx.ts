import { LUCK } from '@/lib/constants';
import type { MarkWho, RoomState, SceneChoice } from '@/types';

export function holds(room: RoomState, myId: string | undefined, who: MarkWho, mark: string) {
  if (who === 'world') return room.world.some((m) => m.id === mark);
  const me = room.players.find((p) => p.userId === myId);
  if (!me) return false;
  if (who === 'self') return me.marks.some((m) => m.id === mark);
  return room.players.some((p) => p.team !== me.team && p.marks.some((m) => m.id === mark));
}

export function choiceFx(room: RoomState, myId: string | undefined, c: SceneChoice) {
  const tags = c.mods.filter((m) => holds(room, myId, m.who, m.mark));
  const locked = c.lock && holds(room, myId, c.lock.who, c.lock.mark) ? c.lock.reason : null;
  return { tags, locked };
}

/** Each move with its tags and lock. If every move is locked, none is (the server does the same). */
export function openMoves(room: RoomState, myId: string | undefined) {
  const rows = (room.scene?.choices ?? []).map((c) => ({ c, ...choiceFx(room, myId, c) }));
  const stuck = rows.length > 0 && rows.every((r) => r.locked);
  return rows.map((r) => ({ ...r, locked: stuck ? null : r.locked }));
}

/**
 * A move gets ONE note: easier or harder, never both.
 * If several story effects apply, they are added together and the biggest one in the winning direction is named.
 */
export function netTag(tags: { delta: number; label: string }[]) {
  const net = tags.reduce((sum, t) => sum + t.delta, 0);
  if (!tags.length || net === 0) return null;
  const dir = Math.sign(net);
  const lead = tags.filter((t) => Math.sign(t.delta) === dir).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  return { easier: net < 0, amount: Math.abs(net), label: lead.label };
}

/** A tag only for very high (19-20) or very low (1-2) dice. If the other side is just as extreme, nobody gets one. */
export function luckTag(die: number, others: number[] = []) {
  const band = (d: number) => (d >= 19 ? 'high' : d <= 2 ? 'low' : null);
  const mine = band(die);
  if (!mine) return null;
  if (others.some((o) => band(o) === mine)) return null;
  return LUCK[mine];
}

/** "12 + 2 story + 2 boost" - only the parts that exist */
export function rollSum(die: number, modifier: number, bonus: number) {
  const parts = [`${die}`];
  if (modifier) parts.push(`${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)} story`);
  if (bonus) parts.push(`+ ${bonus} boost`);
  return parts.length > 1 ? parts.join(' ') : null;
}
