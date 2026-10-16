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
        // your private roll survives other players' updates during the edge step, and nothing else
        myRoll: s.myRoll && room.phase === 'edge' && s.myRoll.round === room.round ? s.myRoll : null,
        finished: sameRoom ? s.finished : null,
        rematchReady: sameRoom ? s.rematchReady : [],
        // the server sends time remaining, so this stays right even on a phone with a wrong clock
        localDeadline: room.status === 'active' && room.remainingMs != null ? Date.now() + room.remainingMs : null,
      };
    }),
  setMyRoll: (myRoll) => set({ myRoll }),
  setResult: (result) => set({ result, myRoll: null }),
  setFinished: (finished) => set({ finished, result: null, myRoll: null }),
  setRematch: (rematchReady) => set({ rematchReady }),
  reset: () => set({ room: null, localDeadline: null, myRoll: null, result: null, finished: null, rematchReady: [] }),
}));