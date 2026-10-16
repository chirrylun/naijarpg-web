'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/stores/toast';

export function SaveProgress({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<'create' | 'signin'>('create');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast.getState().push;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast('Use a password of at least 8 characters', 'bad');
    setBusy(true);
    const { error } =
      mode === 'create'
        ? await supabase.auth.updateUser({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast(error.message, 'bad');
    if (mode === 'create') toast('Check your email to confirm your account ✉️', 'good');
    else toast('Welcome back!', 'good');
    qc.invalidateQueries();
    onClose();
  }

  const input = 'h-12 w-full rounded-2xl border border-line bg-panel-2 px-4 outline-none focus:border-brand';
  return (
    <Modal open={open} onClose={onClose} title={mode === 'create' ? 'Save your progress' : 'Sign in'}>
      <p className="mb-4 text-sm text-mute">
        {mode === 'create'
          ? 'Keep your stars, streak and rank on any phone. Stars can only be bought with an account.'
          : 'Heads up: signing in switches you to that account. Progress on this guest profile stays behind.'}
      </p>
      <form onSubmit={submit} className="space-y-3">
        <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" size="lg" className="w-full" loading={busy}>
          {mode === 'create' ? 'Create account' : 'Sign in'}
        </Button>
      </form>
      <button onClick={() => setMode(mode === 'create' ? 'signin' : 'create')} className="mt-3 w-full text-center text-sm font-semibold text-brand">
        {mode === 'create' ? 'Already have an account? Sign in' : 'New here? Create an account'}
      </button>
    </Modal>
  );
}