'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { REFERRAL_STARS } from '@/lib/constants';
import { copyText, whatsappUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';

type Referral = { code: string; link: string; invited: number; rewarded: number };

export function ReferralCard() {
  const userId = useSession((s) => s.session?.user.id);
  const { data } = useQuery({
    queryKey: ['referrals', userId],
    queryFn: () => api<Referral>('/api/referrals'),
    enabled: !!userId,
  });
  if (!data) return null;

  const msg = `Join me on Naija RPG 🎲 Real Naija wahala, one d20. We both get ${REFERRAL_STARS} free stars: ${data.link}`;
  return (
    <Card className="border-gold/30 bg-gold/5">
      <div className="font-display text-lg font-extrabold">Invite friends, get ★ {REFERRAL_STARS} each</div>
      <p className="mt-1 text-sm text-mute">You both get stars when your friend finishes their first game.</p>
      <div className="mt-3 truncate rounded-xl border border-line bg-panel-2 px-3 py-2 text-sm">{data.link}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="gold"
          onClick={async () => useToast.getState().push((await copyText(data.link)) ? 'Link copied' : 'Copy failed', 'good')}
        >
          Copy link
        </Button>
        <a
          href={whatsappUrl(msg)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center rounded-2xl bg-[#25d366] px-3 text-sm font-extrabold text-[#04110b]"
        >
          WhatsApp
        </a>
      </div>
      <p className="mt-2 text-xs text-mute">
        {data.invited} invited · {data.rewarded} rewarded
      </p>
    </Card>
  );
}