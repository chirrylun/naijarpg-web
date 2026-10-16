import type { Gained, MarkInfo, RoomState } from '@/types';

export function MarkChips({ marks }: { marks: MarkInfo[] }) {
  if (!marks.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {marks.map((m) => (
        <span key={m.id} title={m.tip} className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">
          {m.label}
        </span>
      ))}
    </div>
  );
}

/** Easier / harder / locked notes under a move */
export function ChoiceTags({ tags, locked }: { tags: { delta: number; label: string }[]; locked: string | null }) {
  if (!tags.length && !locked) return null;
  return (
    <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-bold">
      {locked && <span className="text-danger">🔒 {locked}</span>}
      {tags.map((t, i) => (
        <span key={i} className={t.delta < 0 ? 'text-brand' : 'text-orange-300'}>
          {t.delta < 0 ? 'Easier' : 'Harder'} · {t.label}
        </span>
      ))}
    </span>
  );
}

/** Lines from the story that depend on earlier choices */
export function Twists({ lines }: { lines: string[] }) {
  if (!lines.length) return null;
  return (
    <div className="mt-3 space-y-1 rounded-xl border border-gold/30 bg-gold/5 p-3 text-sm text-gold">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}

/** What each player earned this round, with what it means */
export function GainedMarks({ gained, room, myId }: { gained: Gained[]; room: RoomState; myId?: string }) {
  if (!gained.length) return null;
  const who = (id: string | null) =>
    id === null ? 'Everyone' : id === myId ? 'You' : (room.players.find((p) => p.userId === id)?.username ?? 'Player');
  return (
    <div className="space-y-1 rounded-2xl border border-gold/30 bg-gold/5 p-3 text-left text-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-gold">What this changes</div>
      {gained.map((g, i) => (
        <p key={i}>
          <span className="font-bold">{who(g.userId)}: {g.label}.</span> <span className="text-mute">{g.tip}</span>
        </p>
      ))}
    </div>
  );
}

export function StoryRecap({ story, epilogue }: { story: string[]; epilogue: string[] }) {
  if (!story.length) return null;
  return (
    <div className="space-y-2 rounded-3xl border border-line bg-panel p-4">
      <div className="font-display text-lg font-extrabold">How it went</div>
      <ol className="space-y-2 text-sm text-ink/90">
        {story.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-bold text-brand">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      {epilogue.map((e, i) => (
        <p key={i} className="border-t border-line pt-2 text-sm italic text-mute">{e}</p>
      ))}
    </div>
  );
}