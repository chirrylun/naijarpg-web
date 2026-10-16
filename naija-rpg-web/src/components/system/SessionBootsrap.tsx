'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/stores/session';

export function SessionBootstrap() {
  const session = useSession((s) => s.session);
  const synced = useRef<string | null>(null);
  const userId = session?.user.id;
  const anonymous = session?.user.is_anonymous;

  useEffect(() => {
    void useSession.getState().init();
  }, []);

  useEffect(() => {
    if (!userId) return;
    // A referral link was opened earlier: claim it once a player exists
    const code = localStorage.getItem('nrpg_ref');
    if (code) {
      localStorage.removeItem('nrpg_ref');
      api('/api/referrals/claim', { body: { code } }).catch(() => {});
    }
    // Guest just became a real account: tell the server
    if (!anonymous && synced.current !== userId) {
      synced.current = userId;
      api('/api/me/sync', { method: 'POST' }).catch(() => {});
    }
  }, [userId, anonymous]);

  return null;
}