import { create } from 'zustand';
import type { FinishedPayload, PrivateRoll, RoomState, RoundResult } from '@/types';

type GameState = {
  room: RoomState | null;
  localDeadline: number | null;
  myRoll: PrivateRoll | null;
  result: RoundResult | null;
  finished: FinishedPayload | null;
  rematchReady: string[];
  setRoom: (r: RoomState) => void;
  setMyRoll: (r: PrivateRoll) => void;
  setResult: (r: RoundResult) => void;
  setFinished: (f: FinishedPayload) => void;
  setRematch: (ids: string[]) => void;
  reset: () => void;
};

export const useGame = create<GameState>((set) => ({
  room: null,
  localDeadline: null,
  myRoll: null,
  result: null,
  finished: null,
  rematchReady: [],
  setRoom: (room) =>
  set((s) => {
    const sameRoom = s.room?.id === room.id;
    return {
      room,
      result: null,
      // keep the private roll for this round (or a newer one that raced ahead of the room update)
      myRoll: s.myRoll && s.myRoll.round >= room.round ? s.myRoll : null,
      finished: sameRoom ? s.finished : null,
      rematchReady: sameRoom ? s.rematchReady : [],
      localDeadline: room.status === 'active' && room.remainingMs != null ? Date.now() + room.remainingMs : null,
    };
  }),
  setMyRoll: (myRoll) => set({ myRoll }),
  setResult: (result) => set({ result, myRoll: null }),
  setFinished: (finished) => set({ finished, result: null, myRoll: null }),
  setRematch: (rematchReady) => set({ rematchReady }),
  reset: () => set({ room: null, localDeadline: null, myRoll: null, result: null, finished: null, rematchReady: [] }),
}));