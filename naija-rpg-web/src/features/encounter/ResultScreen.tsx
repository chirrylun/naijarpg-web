'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, btn } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/features/avatar/Avatar';
import { SaveProgress } from '@/features/account/SaveProgress';
import { requestChat } from '@/features/chat/requestChat';
import { useMe } from '@/hooks/useMe';
import { errorText } from '@/lib/api';
import { OUTCOME_COPY } from '@/lib/constants';
import { emitAck } from '@/lib/socket';
import { siteUrl, whatsappUrl } from '@/lib/utils';
import { useGame } from '@/stores/game';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';
import type { FinishedPayload, RoomState } from '../../types';

/** What the game did to your star balance: what was paid out minus the entry you put in. */
const netStars = (r: { stars: number; entry: number }) => {
  const net = r.stars - r.entry;
  return net > 0 ? `+${net}★` : net < 0 ? `−${-net}★` : '±0★';
};

/** The scenes ended level, so one die each decided it. Shown plainly so nobody wonders why. */
function Decider({ room, finished, myId }: { room: RoomState; finished: FinishedPayload; myId?: string }) {
  const myTeam = room.players.find((p) => p.userId === myId)?.team ?? 0;
  const last = finished.decider![finished.decider!.length - 1];
  const mine = last.find((t) => t.team === myTeam)?.die;
  const theirs = last.find((t) => t.team !== myTeam)?.die;
  return (
    <Card className="border-sky/30 bg-sky/5 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-sky">Scenes were level</div>
      <p className="mt-1 text-sm text-ink/90">
        One die each decided it{finished.decider!.length > 1 ? ` (after ${finished.decider!.length - 1} re-roll${finished.decider!.length > 2 ? 's' : ''})` : ''}.
      </p>
      <p className="mt-1 font-display text-2xl font-extrabold">
        You {mine} <span className="text-mute">-</span> {theirs}
      </p>
    </Card>
  );
}

export function ResultScreen({ room, finished }: { room: RoomState; finished: FinishedPayload }) {
  const router = useRouter();
  const myId = useSession((s) => s.session?.user.id);
  const { data: me } = useMe();
  const ready = useGame((s) => s.rematchReady);
  const [saveOpen, setSaveOpen] = useState(false);
  const [asked, setAsked] = useState(false);

  const mine = finished.results.find((r) => r.userId === myId);
  const others = finished.results.filter((r) => r.userId !== myId);
  const copy = OUTCOME_COPY[mine?.result ?? 'draw'];
  const won = mine?.result === 'win' || mine?.result === 'success';
  const ending = mine ? finished.endings?.[mine.result] : undefined;

  const share = `${won ? 'I just won' : 'I just played'} "${room.scenario.title}" on Naija RPG 🎲 Think you can beat me? ${siteUrl()}/${me?.referral_code ? `?ref=${me.referral_code}` : ''}`;

  async function rematch() {
    setAsked(true);
    try {
      await emitAck('rematch:request', { roomId: finished.roomId });
    } catch (e) {
      setAsked(false);
      useToast.getState().push(errorText(e), 'bad');
    }
  }
  function playAgain() {
    useGame.getState().reset();
    router.push('/play');
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="text-6xl">{copy.emoji}</div>
        <h1 className={`mt-2 font-display text-4xl font-extrabold ${copy.color}`}>{copy.title}</h1>
        {mine && (
          <p className="mt-1 font-display text-xl font-extrabold text-gold">
            +{mine.points} points · {netStars(mine)}
          </p>
        )}
        {mine && (
          <p className="mt-1 text-xs text-mute">
            Entry ★{mine.entry} · {mine.stars > 0 ? `paid out ★${mine.stars}` : 'no stars paid out'}
          </p>
        )}
        {mine?.capped && <p className="mt-1 text-xs text-mute">You have reached today&apos;s limit for profit stars. Your entry still came back.</p>}
        <p className="mt-1 text-sm text-mute">{room.scenario.title}</p>
      </motion.div>

      {finished.decider && finished.decider.length > 0 && <Decider room={room} finished={finished} myId={myId} />}

      {finished.bonus && mine?.bonus && (
        <Card className={mine.bonus === 'earned' ? 'border-brand/30 bg-brand/5' : 'border-line'}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-mute">Bonus · {finished.bonus.label}</div>
          <p className={`mt-1 font-semibold ${mine.bonus === 'earned' ? 'text-brand' : 'text-mute'}`}>
            {mine.bonus === 'earned' ? `${finished.bonus.earnedLine} +5 pts` : finished.bonus.lostMessage}
          </p>
        </Card>
      )}

      {ending && (
        <Card className="border-gold/30 bg-gold/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gold">How it ended</div>
          <p className="mt-1 leading-relaxed text-ink/90">{ending}</p>
        </Card>
      )}

      <Card className="space-y-2">
        {finished.results.map((r) => {
          const p = room.players.find((x) => x.userId === r.userId);
          return (
            <div key={r.userId} className="flex items-center gap-3">
              <Avatar look={p?.avatar} size={40} crop="bust" />
              <span className="flex-1 truncate font-semibold">{r.userId === myId ? 'You' : r.username}</span>
              <span className="text-xs font-bold uppercase text-mute">{r.result}</span>
              <span className="font-bold text-gold">
                +{r.points} · {netStars(r)}
              </span>
            </div>
          );
        })}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" onClick={rematch} disabled={asked}>
          {asked ? `Waiting ${ready.length}/${room.capacity}` : `Rematch · ★${room.entry}`}
        </Button>
        <Button size="lg" variant="ghost" onClick={playAgain}>
          New game
        </Button>
      </div>
      <a href={whatsappUrl(share)} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center rounded-2xl bg-[#25d366] font-display font-extrabold text-[#04110b]">
        Brag on WhatsApp
      </a>

      {others.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {others.map((o) => (
            <Button key={o.userId} size="sm" variant="ghost" onClick={() => requestChat(o.username)}>
              💬 Chat with {o.username}
            </Button>
          ))}
        </div>
      )}

      {me?.is_guest && (
        <Card className="border-brand/30 bg-brand/5 text-center">
          <div className="font-display text-lg font-extrabold">Don&apos;t lose your progress</div>
          <p className="mt-1 text-sm text-mute">Create an account to keep your stars, streak and rank.</p>
          <Button className="mt-3" onClick={() => setSaveOpen(true)}>
            Save my progress
          </Button>
        </Card>
      )}

      <Link href="/" onClick={() => useGame.getState().reset()} className={btn('ghost', 'md', 'w-full')}>
        ← Back to home
      </Link>
      <SaveProgress open={saveOpen} onClose={() => setSaveOpen(false)} />
    </div>
  );
}