'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SaveProgress } from '@/features/account/SaveProgress';
import { ApiError, api, errorText } from '@/lib/api';
import { STAR_PLAYS } from '@/lib/constants';
import { useToast } from '@/stores/toast';
import type { Pack } from '@/types';

export function StarShop() {
  const packs = useQuery({ queryKey: ['packs'], queryFn: () => api<Pack[]>('/api/stars/packs', { auth: false }) });
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

  const best = Math.max(...(packs.data ?? []).map((p) => p.stars / p.priceNaira), 0);
  return (
    <div className="space-y-4">
      <Card>
        <div className="font-display text-lg font-extrabold">What stars do</div>
        <ul className="mt-2 space-y-1 text-sm text-mute">
          {Object.values(STAR_PLAYS).map((s) => (
            <li key={s.label}>
              <span className="font-bold text-gold">★ {s.cost}</span> <span className="font-bold text-ink">{s.label}:</span> {s.blurb}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-mute">One star play per round, and everyone sees it. Stars nudge luck, they don&apos;t buy wins.</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {packs.isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-36" />)}
        {packs.data?.map((p) => (
          <Card key={p.id} className="relative flex flex-col items-center py-5 text-center">
            {p.stars / p.priceNaira === best && (
              <span className="absolute -top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-[#241800]">BEST VALUE</span>
            )}
            <div className="font-display text-4xl font-extrabold text-gold">★ {p.stars}</div>
            <div className="mt-1 text-sm text-mute">₦{p.priceNaira.toLocaleString('en-NG')}</div>
            <Button className="mt-3" variant="gold" loading={busy === p.id} onClick={() => buy(p.id)}>
              Buy
            </Button>
          </Card>
        ))}
      </div>
      <SaveProgress open={saveOpen} onClose={() => setSaveOpen(false)} />
    </div>
  );
}