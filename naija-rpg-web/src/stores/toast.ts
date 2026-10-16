import { create } from 'zustand';

type Tone = 'good' | 'bad' | 'info';
type Toast = { id: number; text: string; tone: Tone };

export const useToast = create<{
  items: Toast[];
  push: (text: string, tone?: Tone) => void;
  dismiss: (id: number) => void;
}>((set, get) => ({
  items: [],
  push: (text, tone = 'info') => {
    const id = Date.now() + Math.random();
    set((s) => ({ items: [...s.items.slice(-2), { id, text, tone }] }));
    setTimeout(() => get().dismiss(id), 3800);
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));