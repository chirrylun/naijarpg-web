'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Button, btn } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SaveProgress } from '@/features/account/SaveProgress';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';

type State =
  | { status: 'working' }
  | { status: 'done'; email: string }
  | { status: 'problem'; title: string; body: string; resendTo?: string };

const EXPIRED_TITLE = 'That link is no longer valid';
const EXPIRED_BODY =
  'Confirmation links work once and expire quickly. Some email apps open links before you do, which uses them up. If you already confirmed, just sign in with your email and password. Otherwise we can send a fresh link.';

/** Supabase reports a failed link as error params in the URL hash (or query string). */
function readUrlError() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const query = new URLSearchParams(window.location.search);
  const get = (k: string) => hash.get(k) ?? query.get(k);
  const code = get('error_code');
  const description = get('error_description');
  if (!code && !description && !get('error')) return null;
  return { code, description };
}

export default function AuthCallbackPage() {
  const qc = useQueryClient();
  const ran = useRef(false);
  const [state, setState] = useState<State>({ status: 'working' });
  const [sending, setSending] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    void (async () => {
      const urlError = readUrlError();

      // Lets supabase-js finish reading the tokens out of the URL before we look at the session.
      await useSession.getState().init();

      // Ask the auth server for the real user instead of trusting the cached session.
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (user && !user.is_anonymous) {
        // Confirmed. This also covers "the link says expired but it was already used successfully".
        await supabase.auth.refreshSession();
        try {
          await api('/api/me/sync', { method: 'POST' });
        } catch {
          // Not fatal: the database also syncs the guest flag itself when the email is confirmed.
        }
        qc.invalidateQueries();
        setState({ status: 'done', email: user.email ?? '' });
        return;
      }

      if (urlError) {
        const expired = urlError.code === 'otp_expired' || /expired|invalid/i.test(urlError.description ?? '');
        setState({
          status: 'problem',
          title: expired ? EXPIRED_TITLE : "We couldn't confirm your email",
          body: expired ? EXPIRED_BODY : (urlError.description ?? 'Something went wrong. Please try again.'),
          resendTo: user?.new_email ?? undefined,
        });
        return;
      }

      if (user) {
        setState({
          status: 'problem',
          title: 'Not confirmed yet',
          body: 'Open the link in the email we sent you to finish saving your account.',
          resendTo: user.new_email ?? undefined,
        });
        return;
      }

      setState({
        status: 'problem',
        title: "You're not signed in on this device",
        body: 'If you already confirmed your email, sign in with your email and password.',
      });
    })();
  }, [qc]);

  async function resend(email: string) {
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: 'email_change',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSending(false);
    const toast = useToast.getState().push;
    if (error) return toast(error.message, 'bad');
    toast('New link sent. Check your inbox ✉️', 'good');
  }

  if (state.status === 'working') {
    return (
      <Card className="mx-auto mt-10 max-w-md py-10 text-center" role="status" aria-live="polite">
        <div className="mx-auto size-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="mt-3 text-sm text-mute">Confirming your account…</p>
      </Card>
    );
  }

  if (state.status === 'done') {
    return (
      <Card className="mx-auto mt-10 max-w-md space-y-3 py-10 text-center" role="status" aria-live="polite">
        <div className="text-5xl">✅</div>
        <h1 className="font-display text-2xl font-extrabold">Account saved</h1>
        <p className="text-sm text-mute">
          {state.email ? `You're signed in as ${state.email}. ` : ''}
          Your stars, streak and rank are now safe on any phone.
        </p>
        <Link href="/play" className={btn('primary', 'md', 'mt-2')}>
          Keep playing
        </Link>
      </Card>
    );
  }

  return (
    <>
      <Card className="mx-auto mt-10 max-w-md space-y-3 py-10 text-center" role="alert">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-display text-2xl font-extrabold">{state.title}</h1>
        <p className="text-sm text-mute">{state.body}</p>
        <div className="flex flex-col gap-2 pt-2">
          {state.resendTo && (
            <Button size="lg" loading={sending} onClick={() => resend(state.resendTo!)}>
              Send a new link
            </Button>
          )}
          <Button variant="ghost" onClick={() => setSignInOpen(true)}>
            Sign in
          </Button>
          <Link href="/" className="text-sm font-semibold text-brand">
            Back to home
          </Link>
        </div>
      </Card>
      <SaveProgress open={signInOpen} onClose={() => setSignInOpen(false)} initialMode="signin" />
    </>
  );
}
