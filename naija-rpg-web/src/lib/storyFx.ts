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