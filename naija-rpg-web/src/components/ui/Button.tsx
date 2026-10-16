import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'gold' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const V: Record<Variant, string> = {
  primary: 'bg-brand text-[#04110b] shadow-[0_4px_0_0_var(--color-brand-deep)]',
  gold: 'bg-gold text-[#241800] shadow-[0_4px_0_0_var(--color-gold-deep)]',
  ghost: 'border border-line bg-panel-2 text-ink shadow-[0_4px_0_0_var(--color-line)]',
  danger: 'bg-danger text-white shadow-[0_4px_0_0_#b03a3a]',
};
const S: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-14 px-7 text-lg',
};

/** Use on <Link> too: <Link className={btn('gold','lg')}> */
export const btn = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-2xl font-display font-extrabold transition active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-50',
    V[variant],
    S[size],
    extra,
  );

export function Button({
  variant,
  size,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return (
    <button {...rest} disabled={disabled || loading} className={btn(variant, size, className)}>
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}