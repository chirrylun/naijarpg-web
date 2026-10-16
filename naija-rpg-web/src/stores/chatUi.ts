import { create } from 'zustand';
import type { Conversation } from '@/types';

const KEY = 'nrpg_chat_seen';
const load = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
};
const save = (v: Record<string, number>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

type ChatUi = {
  open: boolean;
  convId: string | null;
  unread: Record<string, number>;
  lastSeen: Record<string, number>;
  setOpen: (o: boolean) => void;
  setConv: (id: string | null) => void;
  bump: (convId: string) => void;
  markRead: (convId: string, lastId?: number) => void;
  sync: (convs: Conversation[], myId?: string) => void;
};

export const useChatUi = create<ChatUi>((set, get) => ({
  open: false,
  convId: null,
  unread: {},
  lastSeen: load(),
  setOpen: (open) => set({ open }),
  setConv: (convId) => set({ convId }),
  bump: (id) => set((s) => ({ unread: { ...s.unread, [id]: (s.unread[id] ?? 0) + 1 } })),
  markRead: (id, lastId) => {
    const lastSeen = { ...get().lastSeen };
    if (lastId && lastId > (lastSeen[id] ?? 0)) {
      lastSeen[id] = lastId;
      save(lastSeen);
    }
    set((s) => ({ lastSeen, unread: { ...s.unread, [id]: 0 } }));
  },
  // messages that arrived while the player was offline still count as unread
  sync: (convs, myId) =>
    set((s) => {
      const unread = { ...s.unread };
      for (const c of convs) {
        if (c.last && c.last.sender_id !== myId && c.last.id > (s.lastSeen[c.id] ?? 0)) unread[c.id] = Math.max(unread[c.id] ?? 0, 1);
      }
      return { unread };
    }),
}));