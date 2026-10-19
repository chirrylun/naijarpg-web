'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SaveProgress } from '@/features/account/SaveProgress';
import { ApiError, api, errorText } from '@/lib/api';
import { COMEBACK_STARS, ENTRY_COST, PAYOUT, STAR_PLAYS } from '@/lib/constants';
import { useToast } from '@/stores/toast';
import type { Pack, StarPlay } from '../../types';

export function StarShop() {
  const packs = useQuery({ queryKey: ['packs'], queryFn: () => api<Pack[]>('/api/stars/packs', { auth: false }) });
  // firstPurchaseBonus is 0 once the player has bought a pack before
  const info = useQuery({ queryKey: ['stars'], queryFn: () => api<{ stars: number; firstPurchaseBonus: number }>('/api/stars') });
  const bonus = info.data?.firstPurchaseBonus ?? 0;
  const [busy, setBusy] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  async function buy(packId: string) {
    setBusy(packId);
    try {
      const r = await api<{ url: string }>('/api/stars/checkout', { body: { packId } });
      window.location.href = r.url;
    } catch (e) {
      setBusy(null);
      if (e instanceof ApiError && e.code === 'signup_required') setSaveOpen(true);
      else useToast.getState().push(errorText(e), 'bad');
    }
  }

  const list = [...(packs.data ?? [])].sort((a, b) => a.priceNaira - b.priceNaira);
  const best = list.length ? Math.max(...list.map((p) => p.stars / p.priceNaira)) : 0;
  const plays = (Object.keys(STAR_PLAYS) as StarPlay[]).filter((k) => k !== 'shield');

  return (
    <div className="space-y-4">
      {bonus > 0 && (
        <Card className="border-gold/40 bg-gold/10 text-center">
          <div className="font-display text-lg font-extrabold text-gold">First pack bonus: +★{bonus} free</div>
          <p className="mt-1 text-sm text-mute">Buy any pack for the first time and we add ★{bonus} on top.</p>
        </Card>
      )}

      <Card>
        <div className="font-display text-lg font-extrabold">What stars do</div>
        <ul className="mt-2 space-y-1 text-sm text-mute">
          <li>
            <span className="font-bold text-gold">★ {ENTRY_COST.duel}</span> <span className="font-bold text-ink">Face Off or Link Up:</span> the entry to start. Win and ★{PAYOUT.duel} comes back.
          </li>
          <li>
            <span className="font-bold text-gold">★ {ENTRY_COST.solo}</span> <span className="font-bold text-ink">Solo:</span> make it and your star comes back.
          </li>
          {plays.map((k) => (
            <li key={k}>
              <span className="font-bold text-gold">★ {STAR_PLAYS[k].cost}</span> <span className="font-bold text-ink">{STAR_PLAYS[k].label}:</span> {STAR_PLAYS[k].blurb}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-mute">
          One boost per round. Stars increase your chances, they don&apos;t buy wins. Out of stars? You get a free ★{COMEBACK_STARS} once a day.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {packs.isLoading && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36" />)}
        {list.map((p) => (
          <Card key={p.id} className="relative flex flex-col items-center py-5 text-center">
            {p.stars / p.priceNaira === best && (
              <span className="absolute -top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-[#241800]">BEST VALUE</span>
            )}
            <div className="font-display text-3xl font-extrabold text-gold">★ {p.stars}</div>
            <div className="mt-1 text-sm text-mute">₦{p.priceNaira.toLocaleString('en-NG')}</div>
            <Button className="mt-3" size="sm" variant="gold" loading={busy === p.id} onClick={() => buy(p.id)}>
              Buy
            </Button>
          </Card>
        ))}
      </div>
      <SaveProgress open={saveOpen} onClose={() => setSaveOpen(false)} />
    </div>
  );
}