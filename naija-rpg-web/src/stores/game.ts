import { create } from 'zustand';
import type { FinishedPayload, RoomState, RoundResult } from '@/types';

type GameState = {
  room: RoomState | null;
  localDeadline: number | null;
  result: RoundResult | null;
  finished: FinishedPayload | null;
  rematchReady: string[];
  setRoom: (r: RoomState) => void;
  setResult: (r: RoundResult) => void;
  setFinished: (f: FinishedPayload) => void;
  setRematch: (ids: string[]) => void;
  reset: () => void;
};

export const useGame = create<GameState>((set) => ({
  room: null,
  localDeadline: null,
  result: null,
  finished: null,
  rematchReady: [],
  setRoom: (room) =>
    set((s) => {
      const sameRoom = s.room?.id === room.id;
      return {
        room,
        result: null,
        finished: sameRoom ? s.finished : null,
        rematchReady: sameRoom ? s.rematchReady : [],
        // the server sends time remaining, so this stays right even on a phone with a wrong clock
        localDeadline: room.status === 'active' && room.remainingMs != null ? Date.now() + room.remainingMs : null,
      };
    }),
  setResult: (result) => set({ result }),
  setFinished: (finished) => set({ finished, result: null }),
  setRematch: (rematchReady) => set({ rematchReady }),
  reset: () => set({ room: null, localDeadline: null, result: null, finished: null, rematchReady: [] }),
}));