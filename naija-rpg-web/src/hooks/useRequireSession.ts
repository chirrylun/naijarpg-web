import { useEffect } from 'react';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';

/** Pages that need a player: creates a guest session on arrival if there isn't one. */
export function useRequireSession() {
  const session = useSession((s) => s.session);
  useEffect(() => {
    useSession
      .getState()
      .ensureSession()
      .catch(() => useToast.getState().push("Couldn't start a guest session. Check your network.", 'bad'));
  }, []);
  return session;
}