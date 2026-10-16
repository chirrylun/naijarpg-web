import { API_URL } from './env';
import { useSession } from '@/stores/session';

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

type Opts = { method?: 'GET' | 'POST' | 'PATCH'; body?: unknown; auth?: boolean };

export async function api<T>(path: string, { method, body, auth = true }: Opts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = useSession.getState().session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: method ?? (body !== undefined ? 'POST' : 'GET'),
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? 'request_failed');
  return data as T;
}

const MESSAGES: Record<string, string> = {
  unauthorized: 'Sign-in hiccup. Refresh and try again.',
  slow_down: 'Easy! Too fast. Try again in a moment.',
  not_enough_stars: "You don't have enough stars for that.",
  signup_required: 'Create an account to buy stars.',
  room_full: 'That game is already full.',
  already_decided: "You've already decided.",
  not_accepting_actions: 'Too late, that step is over.',
  invite_not_found: 'That challenge has expired.',
  already_in_encounter: "You're already in a game.",
  play_together_first: 'Play a game together before chatting.',
  request_pending: 'A chat request is already pending.',
  already_connected: "You're already connected.",
  try_later: 'They said no recently. Try again tomorrow.',
  cannot_request: "You can't send a request to this player.",
  username_taken: 'That username is taken.',
  invalid_input: 'Check what you entered and try again.',
  player_not_found: "Couldn't find that player.",
  payments_unavailable: 'Payments are not switched on yet.',
  already_owned: 'You already own that.',
  not_connected: "Can't reach the game server. Check your network.",
  timeout: 'The server took too long. Try again.',
};

export const errorText = (e: unknown) =>
  MESSAGES[e instanceof ApiError ? e.code : ''] ?? 'Something went wrong. Try again.';