import { io, type Socket } from 'socket.io-client';
import { API_URL } from './env';
import { ApiError } from './api';
import { useConn } from '../stores/connection'
import { useSession } from '../stores/session';

let socket: Socket | null = null;

function visitorId() {
  let id = localStorage.getItem('nrpg_vid');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('nrpg_vid', id);
  }
  return id;
}

export function getSocket() {
  if (!socket) socket = io(API_URL, { autoConnect: false, auth: { visitorId: visitorId() } });
  return socket;
}

export function waitAuthed(ms = 10_000) {
  return new Promise<void>((resolve, reject) => {
    if (useConn.getState().authed) return resolve();
    const timer = setTimeout(() => {
      unsub();
      reject(new ApiError(0, 'not_connected'));
    }, ms);
    const unsub = useConn.subscribe((s) => {
      if (s.authed) {
        clearTimeout(timer);
        unsub();
        resolve();
      }
    });
  });
}

/** Guest session exists AND the socket has logged in. Call before any game action. */
export async function ensureReady() {
  await useSession.getState().ensureSession();
  await waitAuthed();
}

type Ack<T> = { ok: boolean; data?: T; error?: string };

export async function emitAck<T = unknown>(event: string, payload: unknown = {}): Promise<T> {
  await ensureReady();
  return new Promise<T>((resolve, reject) => {
    getSocket()
      .timeout(8000)
      .emit(event, payload, (err: Error | null, res?: Ack<T>) => {
        if (err) return reject(new ApiError(0, 'timeout'));
        if (!res?.ok) return reject(new ApiError(0, res?.error ?? 'failed'));
        resolve(res.data as T);
      });
  });
}