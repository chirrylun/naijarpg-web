import { create } from 'zustand';

export const useChatUi = create<{
  open: boolean;
  convId: string | null;
  setOpen: (o: boolean) => void;
  setConv: (id: string | null) => void;
}>((set) => ({
  open: false,
  convId: null,
  setOpen: (open) => set({ open }),
  setConv: (convId) => set({ convId }),
}));