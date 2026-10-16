'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { btn } from '@/components/ui/Button';
import { EncounterRoom } from '@/features/encounter/EncounterRoom';
import { WaitingRoom } from '@/features/encounter/WaitingRoom';
import { ResultScreen } from '@/features/encounter/ResultScreen';
import { useRequireSession } from '@/hooks/useRequireSession';
import { useGame } from '@/stores/game';

export default function EncounterPage() {
  const { encounterId } = useParams<{ encounterId: string }>();
  useRequireSession();
  const room = useGame((s) => s.room);
  const finished = useGame((s) => s.finished);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), 9000);
    return () => clearTimeout(t);
  }, []);

  const mine = room && room.id === encounterId ? room : null;
  if (mine && finished && finished.roomId === encounterId) return <ResultScreen room={mine} finished={finished} />;
  if (mine?.status === 'waiting') return <WaitingRoom room={mine} />;
  if (mine) return <EncounterRoom room={mine} />;

  return (
    <Card className="mx-auto mt-10 max-w-sm space-y-3 py-10 text-center">
      {gaveUp ? (
        <>
          <div className="text-4xl">🫠</div>
          <div className="font-display text-xl font-extrabold">This game isn&apos;t available</div>
          <p className="text-sm text-mute">It may have ended or the link has expired.</p>
          <Link href="/play" className={btn('primary', 'md', 'mt-2')}>
            Back to lobby
          </Link>
        </>
      ) : (
        <>
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <div className="font-semibold text-mute">Connecting to the game…</div>
        </>
      )}
    </Card>
  );
}