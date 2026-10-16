import { cn } from '@/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-2xl bg-panel-2', className)} />
);