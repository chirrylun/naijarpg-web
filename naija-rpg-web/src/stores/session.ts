import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type SessionState = {
  session: Session | null;
  ready: boolean;
  init: () => Promise<void>;
  ensureSession: () => Promise<Session>;
  signOut: () => Promise<void>;
};

let initPromise: Promise<void> | null = null;
let guestPromise: Promise<Session> | null = null;

export const useSession = create<SessionState>((set, get) => ({
  session: null,
  ready: false,
  init: () =>
    (initPromise ??= (async () => {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, ready: true });
      supabase.auth.onAuthStateChange((_event, session) => set({ session }));
    })()),
  // Guests are created lazily: only when someone actually starts playing
  ensureSession: async () => {
    await get().init();
    const existing = get().session;
    if (existing) return existing;
    guestPromise ??= (async () => {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error || !data.session) throw error ?? new Error('guest_failed');
      set({ session: data.session });
      return data.session;
    })().finally(() => {
      guestPromise = null;
    });
    return guestPromise;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));