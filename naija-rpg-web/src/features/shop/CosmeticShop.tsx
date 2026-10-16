'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/features/avatar/Avatar';
import { useMe } from '@/hooks/useMe';
import { api, errorText } from '@/lib/api';
import { RARITY_COLOR } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useToast } from '@/stores/toast';
import type { AvatarItem, Look } from '@/types';

const SLOTS: { id: AvatarItem['slot']; label: string }[] = [
  { id: 'outfit', label: 'Outfits' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'shoes', label: 'Shoes' },
];

export function CosmeticShop() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const items = useQuery({ queryKey: ['avatar-items'], queryFn: () => api<AvatarItem[]>('/api/avatars/items', { auth: false }) });
  const mine = useQuery({
    queryKey: ['avatar-mine', me?.id],
    queryFn: () => api<{ owned: string[]; equipped: Look }>('/api/avatars/mine'),
    enabled: !!me,
  });
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast.getState().push;

  const owned = new Set(mine.data?.owned ?? []);
  const equipped = mine.data?.equipped ?? me?.avatar ?? {};
  const refresh = () =>
    Promise.all([qc.invalidateQueries({ queryKey: ['me'] }), qc.invalidateQueries({ queryKey: ['avatar-mine'] })]);

  async function equip(id: string) {
    setBusy(id);
    try {
      await api('/api/avatars/equip', { body: { itemId: id } });
      await refresh();
    } catch (e) {
      toast(errorText(e), 'bad');
    } finally {
      setBusy(null);
    }
  }
  async function buy(item: AvatarItem) {
    setBusy(item.id);
    try {
      await api('/api/avatars/buy', { body: { itemId: item.id } });
      await api('/api/avatars/equip', { body: { itemId: item.id } });
      toast(`${item.name} unlocked! 🔥`, 'good');
      await refresh();
    } catch (e) {
      toast(errorText(e), 'bad');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        <Avatar look={equipped} size={96} />
        <div>
          <div className="font-display text-xl font-extrabold">Your look</div>
          <p className="text-sm text-mute">Cosmetics are just for style. They never change your rolls.</p>
        </div>
      </Card>

      {SLOTS.map((slot) => {
        const list = (items.data ?? []).filter((i) => i.slot === slot.id).sort((a, b) => a.price_stars - b.price_stars);
        if (!list.length) return null;
        return (
          <section key={slot.id}>
            <h3 className="mb-2 font-display text-lg font-extrabold">{slot.label}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {list.map((item) => {
                const has = owned.has(item.id);
                const on = equipped[item.slot] === item.id;
                return (
                  <Card key={item.id} className={cn('flex flex-col items-center text-center', on && 'border-brand')}>
                    <Avatar look={{ ...equipped, [item.slot]: item.id }} size={64} />
                    <div className="mt-1 text-sm font-bold">{item.name}</div>
                    <div className={cn('text-[11px] font-bold uppercase', RARITY_COLOR[item.rarity] ?? 'text-mute')}>{item.rarity}</div>
                    {on ? (
                      <div className="mt-2 text-xs font-bold text-brand">Equipped ✓</div>
                    ) : has ? (
                      <Button size="sm" variant="ghost" className="mt-2" loading={busy === item.id} onClick={() => equip(item.id)}>
                        Equip
                      </Button>
                    ) : (
                      <Button size="sm" variant="gold" className="mt-2" loading={busy === item.id} disabled={(me?.stars ?? 0) < item.price_stars} onClick={() => buy(item)}>
                        ★ {item.price_stars}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}