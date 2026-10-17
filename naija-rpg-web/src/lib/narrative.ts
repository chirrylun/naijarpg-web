import type { RoomState } from '../types';

const join = (names: string[]) =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;

/** Fills {rival} and {partner} for whoever is looking at the screen */
export function fillNames(text: string | null | undefined, room: RoomState, myId?: string) {
  if (!text) return '';
  const me = room.players.find((p) => p.userId === myId);
  const rivals = me && room.mode !== 'coop' ? room.players.filter((p) => p.team !== me.team).map((p) => p.username) : [];
  const partners = me ? room.players.filter((p) => p.team === me.team && p.userId !== me.userId).map((p) => p.username) : [];
  return text.replaceAll('{rival}', join(rivals) || 'your rival').replaceAll('{partner}', join(partners) || 'your partner');
}