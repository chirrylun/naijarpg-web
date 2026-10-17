'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { StarShop } from '@/features/shop/StarShop';
import { CosmeticShop } from '@/features/shop/CosmeticShop';
import { useRequireSession } from '@/hooks/useRequireSession';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';

export default function ShopPage() {
  useRequireSession();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'stars' | 'cosmetics'>('stars');
  const verified = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'cosmetics') setTab('cosmetics');

    // Coming back from Bachs: it adds ?checkout_id=... to the success URL.
    // The webhook is what credits the stars, so we poll until it has landed.
    const checkoutId = params.get('checkout_id');
    if (!checkoutId || verified.current) return;
    verified.current = true;
    const toast = useToast.getState().push;
    let tries = 0;
    const check = async () => {
      try {
        await useSession.getState().ensureSession();
        const r = await api<{ paid: boolean }>(`/api/stars/verify/${encodeURIComponent(checkoutId)}`);
        if (r.paid) {
          toast('Stars added! ★', 'good');
          qc.invalidateQueries({ queryKey: ['me'] });
          window.history.replaceState(null, '', '/shop');
          return;
        }
      } catch {
        /* retry below */
      }
      // about 20 seconds in total, which covers a slow webhook
      if (++tries < 8) setTimeout(check, 2500);
      else toast('Payment not confirmed yet. If you were charged, your stars will arrive shortly.', 'info');
    };
    void check();
  }, [qc]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-extrabold">Shop</h1>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-panel p-1">
        {(['stars', 'cosmetics'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('rounded-xl py-2 text-sm font-bold transition', tab === t ? 'bg-brand text-[#04110b]' : 'text-mute')}>
            {t === 'stars' ? '★ Stars' : '🎨 Cosmetics'}
          </button>
        ))}
      </div>
      {tab === 'stars' ? <StarShop /> : <CosmeticShop />}
    </div>
  );
}