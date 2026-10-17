import type { MarkInfo } from '../../types';

/** Shared story state, kept quiet: plain words, at most two */
export function MarkChips({ marks }: { marks: MarkInfo[] }) {
  if (!marks.length) return null;
  return (
    <span className="truncate text-[11px] font-semibold text-mute" title={marks.map((m) => m.tip).join(' ')}>
      {marks.slice(0, 2).map((m) => m.label).join(' · ')}
    </span>
  );
}

/** Lines from the story that depend on earlier choices */
export function Twists({ lines }: { lines: string[] }) {
  if (!lines.length) return null;
  return (
    <div className="mt-3 space-y-1 border-l-2 border-line pl-3 text-sm italic text-mute">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
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