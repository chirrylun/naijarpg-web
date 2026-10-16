import { create } from 'zustand';
import { ROUND_SECONDS } from '@/lib/constants';
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
      const sameRound = sameRoom && s.room?.round === room.round && s.room?.status === room.status;
      return {
        room,
        result: null,
        finished: sameRoom ? s.finished : null,
        rematchReady: sameRoom ? s.rematchReady : [],
        // The server clock may differ from the phone's, so each new round gets a local 30s countdown
        localDeadline: room.status !== 'active' ? null : sameRound ? s.localDeadline : Date.now() + ROUND_SECONDS * 1000,
      };
    }),
  setResult: (result) => set({ result }),
  setFinished: (finished) => set({ finished, result: null }),
  setRematch: (rematchReady) => set({ rematchReady }),
  reset: () => set({ room: null, localDeadline: null, result: null, finished: null, rematchReady: [] }),
}));