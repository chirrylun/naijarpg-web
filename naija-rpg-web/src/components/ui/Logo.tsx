import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
      <svg width="26" height="26" viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,4 93,28 93,72 50,96 7,72 7,28" fill="var(--color-brand)" />
        <text x="50" y="62" textAnchor="middle" fontSize="38" fontWeight="800" fill="#04110b">20</text>
      </svg>
      <span>
        Naija <span className="text-brand">RPG</span>
      </span>
    </Link>
  );
}