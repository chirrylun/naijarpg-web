import { create } from 'zustand';

export const useConn = create<{ connected: boolean; authed: boolean; liveUsers: number | null }>(() => ({
  connected: false,
  authed: false,
  liveUsers: null,
}));