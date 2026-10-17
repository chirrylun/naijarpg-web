import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSession } from '@/stores/session';
import type { Profile } from '../types';

export function useMe() {
  const userId = useSession((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['me', userId],
    queryFn: () => api<Profile>('/api/me'),
    enabled: !!userId,
    staleTime: 10_000,
  });
}