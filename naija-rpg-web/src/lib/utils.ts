export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export const whatsappUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const winRate = (wins: number, played: number) => (played ? Math.round((wins / played) * 100) : 0);