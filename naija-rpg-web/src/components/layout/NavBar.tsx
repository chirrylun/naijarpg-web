'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Avatar } from '@/features/avatar/Avatar';
import { useMe } from '@/hooks/useMe';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/play', label: 'Play' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/shop', label: 'Shop' },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: me } = useMe();
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-xl px-3 py-1.5 text-sm font-semibold transition',
                pathname.startsWith(l.href) ? 'bg-panel-2 text-ink' : 'text-mute hover:text-ink',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {me && (
            <>
              <Link href="/shop" className="flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-bold text-gold">
                <span>★</span>
                <AnimatedNumber value={me.stars} />
              </Link>
              <Link href={`/profile/${me.username}`} className="hidden sm:block">
                <Avatar look={me.avatar} size={34} crop="bust" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}