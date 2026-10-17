'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/features/avatar/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { emitAck } from '@/lib/socket';
import { copyText, siteUrl, whatsappUrl } from '@/lib/utils';
import { useGame } from '@/stores/game';
import { useToast } from '@/stores/toast';
import type { RoomState } from '../../types';

export function WaitingRoom({ room }: { room: RoomState }) {
  const router = useRouter();
  const link = `${siteUrl()}/c/${room.code}`;
  const msg = `I'm challenging you on Naija RPG 🎲 "${room.scenario.title}". Dice don't lie. Accept if you dare: ${link}`;
  const slots = Array.from({ length: room.capacity }, (_, i) => room.players[i] ?? null);

  async function leave() {
    try {
      await emitAck('room:leave');
    } catch {
      /* leaving anyway */
    }
    useGame.getState().reset();
    router.push('/play');
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Card className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-mute">Challenge ready</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">{room.scenario.title}</h1>
        <p className="mt-1 text-sm text-mute">{room.scenario.tagline}</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((p, i) => (
          <Card key={i} className={p ? 'flex flex-col items-center py-3' : 'flex flex-col items-center justify-center border-dashed py-6 text-mute'}>
            {p ? (
              <>
                <Avatar look={p.avatar} size={56} crop="bust" />
                <div className="mt-1 max-w-full truncate text-sm font-bold">{p.username}</div>
              </>
            ) : (
              <span className="animate-pulse text-sm font-semibold">Waiting…</span>
            )}
          </Card>
        ))}
      </div>

      {room.code && (
        <Card className="space-y-3">
          <div className="truncate rounded-xl border border-line bg-panel-2 px-3 py-2 text-sm">{link}</div>
          <div className="grid grid-cols-2 gap-2">
            <a href={whatsappUrl(msg)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#25d366] font-display font-extrabold text-[#04110b]">
              Send on WhatsApp
            </a>
            <Button variant="ghost" onClick={async () => useToast.getState().push((await copyText(link)) ? 'Link copied' : 'Copy failed', 'good')}>
              Copy link
            </Button>
          </div>
          <p className="text-center text-xs text-mute">The game starts as soon as everyone has joined.</p>
        </Card>
      )}

      <Button variant="ghost" className="w-full" onClick={leave}>
        Leave
      </Button>
    </div>
  );
}