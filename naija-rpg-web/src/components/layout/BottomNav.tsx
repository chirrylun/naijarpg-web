'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMe } from '@/hooks/useMe';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { data: me } = useMe();
  if (/^\/play\/[^/]+/.test(pathname)) return null; // keep the game screen clean

  const items = [
    { href: '/play', label: 'Play', icon: '🎲' },
    { href: '/leaderboard', label: 'Ranks', icon: '🏆' },
    { href: '/shop', label: 'Shop', icon: '⭐' },
    { href: me ? `/profile/${me.username}` : '/play', label: 'Me', icon: '🙂' },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map((i) => (
          <Link
            key={i.label}
            href={i.href}
            className={cn(
              'flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold',
              pathname.startsWith(i.href) && i.href !== '/play' ? 'text-brand' : pathname === '/play' && i.label === 'Play' ? 'text-brand' : 'text-mute',
            )}
          >
            <span className="text-xl leading-none">{i.icon}</span>
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}