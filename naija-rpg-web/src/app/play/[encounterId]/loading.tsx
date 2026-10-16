export default function Loading() {
  return (
    <div className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-3 py-10 text-center">
      <div className="size-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      <div className="font-semibold text-mute">Connecting to the game…</div>
    </div>
  );
}