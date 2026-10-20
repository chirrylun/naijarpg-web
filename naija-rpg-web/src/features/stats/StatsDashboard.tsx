'use client';

import { APPROACHES, MODE_CARDS, TIERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { BarList, Columns, Empty, Legend, LineChart, Section, Stat, StackBars, Table, type Series } from './charts';
import type { AdminStats } from './types';

// ---------- formatting ----------
const num = (x?: number | null) => (x ?? 0).toLocaleString('en-NG');
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '-');
const naira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
const pretty = (id: string) => id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const shortDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });

function ago(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const modeName = (mode: string, format: string) =>
  MODE_CARDS.find((m) => m.mode === mode && m.format === format)?.name ?? `${pretty(mode)} ${format}`;
const modeOnly = (mode: string) => MODE_CARDS.find((m) => m.mode === mode)?.name.replace(/\s*\(.*\)$/, '') ?? pretty(mode);

const approachName = (a: string) => (APPROACHES as Record<string, { label: string }>)[a]?.label ?? pretty(a);
const tierName = (t: string) => (TIERS as Record<string, { label: string }>)[t]?.label ?? pretty(t);

const REASONS: Record<string, string> = {
  star_play: 'Boosts used',
  streak: 'Daily streak',
  solo_entry: 'Solo entry fee',
  game_entry: 'Game entry fee',
  game_win: 'Win reward',
  game_bonus: 'Bonus reward',
  game_refund: 'Game refund',
  entry_refund: 'Entry refund',
  referral: 'Referral',
  purchase: 'Bought stars',
  avatar_item: 'Shop item',
};

const PALETTE = [
  { bar: 'bg-gold', stroke: '#ffc233' },
  { bar: 'bg-brand', stroke: '#1fc77e' },
  { bar: 'bg-sky', stroke: '#5cb8ff' },
  { bar: 'bg-ember', stroke: '#e38b3f' },
];
const BRAND: Series = { name: '', bar: 'bg-brand', stroke: '#1fc77e' };
const GOLD: Series = { name: '', bar: 'bg-gold', stroke: '#ffc233' };
const SKY: Series = { name: '', bar: 'bg-sky', stroke: '#5cb8ff' };
const DANGER: Series = { name: '', bar: 'bg-danger', stroke: '#ff5f5f' };
const named = (s: Series, name: string): Series => ({ ...s, name });

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => (i % 3 === 0 ? String(i) : ''));
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------- plain-language highlights ----------
function highlights(d: AdminStats): string[] {
  const t = d.totals;
  const out: string[] = [];
  if (t.players > 0 && t.never_played / t.players >= 0.25)
    out.push(`${num(t.never_played)} of ${num(t.players)} signups (${pct(t.never_played, t.players)}) never played a game.`);
  const peak = d.hours.indexOf(Math.max(...d.hours));
  if (Math.max(...d.hours) > 0) out.push(`Most games start around ${peak}:00 to ${peak + 1}:00 Lagos time.`);
  const one = d.engagement.find((e) => e.bucket === '1 game');
  const played = d.engagement.filter((e) => e.bucket !== '0 games').reduce((s, e) => s + e.players, 0);
  if (one && played >= 5 && one.players / played >= 0.4)
    out.push(`${pct(one.players, played)} of players who played stopped after one game.`);
  const lostEarly = d.abandon_by_round.find((r) => r.round === 0)?.games ?? 0;
  if (lostEarly > 0) out.push(`${num(lostEarly)} lobbies were left before anybody rolled.`);
  const scen = d.scenarios.filter((s) => s.played >= 5 && s.pass_rate != null);
  if (scen.length >= 2) {
    const hard = [...scen].sort((a, b) => (a.pass_rate ?? 0) - (b.pass_rate ?? 0))[0];
    out.push(`Hardest story right now: ${pretty(hard.scenario_id)} (${hard.pass_rate}% of rolls succeed).`);
  }
  return out.slice(0, 5);
}

export function StatsDashboard({ data, days, setDays, fetching }: { data: AdminStats; days: number; setDays: (n: number) => void; fetching: boolean }) {
  const t = data.totals;
  const dayKeys = data.series.map((s) => s.day);

  // one series per game mode that actually appears
  const modeKeys = [...new Set(data.series.flatMap((s) => Object.keys(s.by_mode)))];
  const modeSeries: Series[] = modeKeys.map((m, i) => ({ name: modeOnly(m), ...PALETTE[i % PALETTE.length] }));
  const modeValues = modeKeys.map((m) => data.series.map((s) => s.by_mode[m] ?? 0));

  const notes = highlights(data);
  const live = data.live;
  const queued = live.queues.reduce((s, q) => s + q.waiting, 0);
  const finishedPlayed = data.modes.reduce((s, m) => s + m.finished, 0);
  const coopTotal = data.coop_outcomes.success + data.coop_outcomes.fail;
  const r = data.retention;
  const funnelTop = Math.max(1, data.funnel[0]?.n ?? 1);

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Stats</h1>
          <p className="text-sm text-mute">
            Lagos time. Updated {ago(data.generated_at)}
            {fetching ? ' · refreshing…' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            {num(live.online)} online · {num(live.activeGames)} live {live.activeGames === 1 ? 'game' : 'games'}
            {queued > 0 ? ` · ${queued} waiting` : ''}
          </span>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-panel p-1">
            {[7, 30, 90].map((n) => (
              <button
                key={n}
                onClick={() => setDays(n)}
                className={cn('rounded-lg px-3 py-1 text-xs font-bold transition', days === n ? 'bg-brand text-[#04110b]' : 'text-mute')}
              >
                {n}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {notes.length > 0 && (
        <Section title="What stands out" hint="Worked out from the numbers below.">
          <ul className="space-y-1.5 text-sm">
            {notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-gold">✦</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* headline numbers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Players" value={num(t.players)} sub={`${num(t.signups_today)} joined today · ${num(t.signups_7d)} this week`} />
        <Stat label="Account type" tone="sky" value={pct(t.registered, t.players)} sub={`${num(t.registered)} registered · ${num(t.guests)} guests`} />
        <Stat label="Active today" tone="gold" value={num(t.dau)} sub={`${num(t.wau)} this week · ${num(t.mau)} this month`} />
        <Stat label="Games today" value={num(t.games_today)} sub={`${num(t.games_7d)} this week · ${num(t.games_played)} ever`} />
        <Stat label="Visits today" tone="sky" value={num(t.visits_today)} sub={`${num(t.visits_total)} all time`} />
        <Stat label="Games finished" tone="gold" value={t.completion_rate != null ? `${t.completion_rate}%` : '-'} sub="of games that started" />
        <Stat label="Average game" value={t.avg_game_minutes != null ? `${t.avg_game_minutes} min` : '-'} sub={`${t.avg_games_per_active_player ?? '-'} games per player`} />
        <Stat label="Revenue" tone="gold" value={naira(data.revenue.total_kobo)} sub={`${num(data.revenue.buyers)} buyers · ${num(data.revenue.pending_orders)} unpaid`} />
      </div>

      {/* daily */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Games played each day" hint="Only games where somebody rolled. Split by mode.">
          <Legend series={modeSeries} />
          <StackBars days={dayKeys} series={modeSeries} values={modeValues} />
        </Section>
        <Section title="New signups each day" hint={`${num(t.signups_window)} in the last ${data.days} days.`}>
          <Legend series={[named(BRAND, 'Registered'), named(SKY, 'Guests')]} />
          <StackBars
            days={dayKeys}
            series={[named(BRAND, 'Registered'), named(SKY, 'Guests')]}
            values={[data.series.map((s) => s.signups - s.guest_signups), data.series.map((s) => s.guest_signups)]}
          />
        </Section>
        <Section title="Active players each day" hint="Players who rolled at least once, and how many of them were new.">
          <Legend series={[named(GOLD, 'Active'), named(BRAND, 'First game')]} />
          <LineChart days={dayKeys} series={[named(GOLD, 'Active'), named(BRAND, 'First game')]} values={[data.series.map((s) => s.active), data.series.map((s) => s.new_players)]} />
        </Section>
        <Section
          title="Site visits each day"
          hint={t.visits_tracked_since ? `Counted since ${shortDate(t.visits_tracked_since)}.` : 'Daily counting starts with the next visit.'}
        >
          <LineChart days={dayKeys} series={[named(SKY, 'Visits')]} values={[data.series.map((s) => s.visits)]} />
        </Section>
      </div>

      {/* modes and stories */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Game modes" hint={`Last ${data.days} days. A lobby is a game that was opened, played means somebody rolled.`}>
          <Table
            head={['Mode', 'Lobbies', 'Played', 'Finished', 'Left']}
            rows={data.modes.map((m) => [
              <span key="n" className="font-semibold">
                {modeName(m.mode, m.format)}
                {m.daily > 0 && <span className="ml-1 text-[10px] text-gold">{m.daily} daily</span>}
              </span>,
              num(m.lobbies),
              num(m.played),
              pct(m.finished, m.played),
              num(m.abandoned),
            ])}
          />
          {coopTotal > 0 && (
            <p className="mt-3 text-sm text-mute">
              Co-op crews succeeded in <b className="text-ink">{pct(data.coop_outcomes.success, coopTotal)}</b> of games ({data.coop_outcomes.success} of {coopTotal}).
            </p>
          )}
        </Section>
        <Section title="Stories" hint="Pass rate is the share of rolls that succeeded. Very high or low means it may be too easy or too hard.">
          <Table
            head={['Story', 'Played', 'Finished', 'Pass', 'Avg time']}
            rows={data.scenarios.map((s) => [
              <span key="n" className="font-semibold">{pretty(s.scenario_id)}</span>,
              num(s.played),
              pct(s.finished, s.played),
              s.pass_rate != null ? `${s.pass_rate}%` : '-',
              s.avg_minutes != null ? `${s.avg_minutes}m` : '-',
            ])}
          />
        </Section>
      </div>

      {/* when */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Busy hours" hint="Games started by hour of the day, Lagos time.">
          <Columns values={data.hours} labels={HOUR_LABELS} />
        </Section>
        <Section title="Busy days" hint="Games started by day of the week.">
          <Columns values={data.weekdays} labels={DAY_LABELS} color="bg-gold" />
        </Section>
      </div>

      {/* people */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="From signup to loyal player" hint="Everyone who ever signed up, and how far they got.">
          <BarList
            rows={data.funnel.map((f) => ({ label: f.step, value: f.n, note: pct(f.n, funnelTop) }))}
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Back next day" tone="sky" value={r.eligible_d1 ? pct(r.d1, r.eligible_d1) : '-'} sub={r.eligible_d1 ? `${r.d1} of ${r.eligible_d1} players` : 'Too early to tell'} />
            <Stat label="Back within a week" tone="sky" value={r.eligible_d7 ? pct(r.d7, r.eligible_d7) : '-'} sub={r.eligible_d7 ? `${r.d7} of ${r.eligible_d7} players` : 'Too early to tell'} />
          </div>
        </Section>
        <Section title="How much people play" hint="Players grouped by total games played.">
          <BarList color="bg-gold" rows={data.engagement.map((e) => ({ label: e.bucket, value: e.players }))} />
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-mute">Daily streaks right now</p>
          <BarList
            color="bg-sky"
            rows={[
              { label: 'No streak', value: data.streaks.none },
              { label: '1 to 2 days', value: data.streaks.d1_2 },
              { label: '3 to 6 days', value: data.streaks.d3_6 },
              { label: '7+ days', value: data.streaks.d7_plus },
            ]}
          />
        </Section>
      </div>

      {/* gameplay */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Moves and results" hint="What people pick, and how often it works.">
          <Table
            head={['Move', 'Picked', 'Works', 'Avg dice']}
            rows={data.approaches.map((a) => [
              <span key="n" className="font-semibold">{approachName(a.approach)}</span>,
              num(a.picks),
              `${a.pass_rate}%`,
              String(a.avg_die),
            ])}
          />
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-mute">How rolls ended</p>
          <BarList color="bg-brand" rows={data.tiers.map((x) => ({ label: tierName(x.tier), value: x.n, note: pct(x.n, data.tiers.reduce((s, y) => s + y.n, 0)) }))} />
        </Section>
        <Section
          title="Boosts"
          hint={`${num(data.star_plays.with_star_play)} of ${num(data.star_plays.rolls)} rolls used a boost (${pct(data.star_plays.with_star_play, data.star_plays.rolls)}).`}
        >
          <BarList
            color="bg-gold"
            rows={Object.entries(data.star_plays.by_type)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => ({ label: pretty(k), value: v }))}
          />
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-mute">Where lobbies are left</p>
          <BarList
            color="bg-danger"
            rows={data.abandon_by_round.map((a) => ({ label: a.round === 0 ? 'Before the first roll' : `After scene ${a.round}`, value: a.games }))}
          />
        </Section>
      </div>

      <Section title="Scenes" hint="Busiest scenes. A low pass rate means players struggle there, a very high one means it is too easy.">
        <Table
          head={['Scene', 'Games', 'Rolls', 'Pass', 'Avg dice']}
          rows={data.scenes.slice(0, 15).map((s) => [
            <span key="n">
              <span className="font-semibold">{pretty(s.scene_key)}</span>
              <span className="ml-1 text-[11px] text-mute">{pretty(s.scenario_id)}</span>
            </span>,
            num(s.games),
            num(s.rolls),
            <span key="p" className={cn(s.pass_rate < 35 && 'text-danger', s.pass_rate > 65 && 'text-gold')}>{s.pass_rate}%</span>,
            String(s.avg_die),
          ])}
        />
      </Section>

      {/* stars and money */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Stars" hint={`Last ${data.days} days.`}>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <Stat label="In wallets" tone="gold" value={num(data.stars.in_circulation)} />
            <Stat label="Earned" value={num(data.stars.earned_window)} />
            <Stat label="Spent" tone="danger" value={num(data.stars.spent_window)} />
          </div>
          <Table
            head={['What for', 'Times', 'Earned', 'Spent']}
            rows={data.stars.by_reason.map((x) => [
              <span key="n" className="font-semibold">{REASONS[x.reason] ?? pretty(x.reason)}</span>,
              num(x.events),
              x.earned ? `+${num(x.earned)}` : '-',
              x.spent ? `-${num(x.spent)}` : '-',
            ])}
          />
        </Section>
        <Section title="Money" hint="Star pack purchases.">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="All time" tone="gold" value={naira(data.revenue.total_kobo)} sub={`${num(data.revenue.paid_orders)} paid orders`} />
            <Stat label={`Last ${data.days} days`} tone="gold" value={naira(data.revenue.window_kobo)} />
            <Stat label="Buyers" value={num(data.revenue.buyers)} sub={`${pct(data.revenue.buyers, t.registered)} of registered`} />
            <Stat label="Not paid" tone="danger" value={num(data.revenue.pending_orders)} sub="started checkout, never paid" />
          </div>
        </Section>
      </div>

      <Section title="Community">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Chat requests" tone="sky" value={num(data.social.chat_requests)} sub={`${num(data.social.chat_requests_accepted)} accepted · ${num(data.social.chat_requests_pending)} waiting`} />
          <Stat label="Messages" tone="sky" value={num(data.social.messages)} sub={`${num(data.social.messages_window)} in ${data.days} days`} />
          <Stat label="Referrals" value={num(data.social.referrals)} sub={`${num(data.social.referrals_rewarded)} rewarded`} />
          <Stat label="Reports / blocks" tone={data.social.reports + data.social.blocks > 0 ? 'danger' : 'brand'} value={`${num(data.social.reports)} / ${num(data.social.blocks)}`} />
        </div>
      </Section>

      {/* people lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Most active players">
          <Table
            head={['Player', 'Games', 'Wins', 'Points', 'Last played']}
            rows={data.top_players.map((p) => [
              <span key="n" className="font-semibold">
                {p.username}
                {p.is_guest && <span className="ml-1 text-[10px] text-mute">guest</span>}
              </span>,
              num(p.games),
              num(p.wins),
              num(p.score),
              p.last_played_on ? shortDate(p.last_played_on) : '-',
            ])}
          />
        </Section>
        <Section title="Newest players">
          <Table
            head={['Player', 'Joined', 'Games', 'Stars']}
            rows={data.recent_players.map((p) => [
              <span key="n" className="font-semibold">
                {p.username}
                {p.is_guest && <span className="ml-1 text-[10px] text-mute">guest</span>}
              </span>,
              ago(p.created_at),
              num(p.games),
              num(p.stars),
            ])}
          />
        </Section>
      </div>

      {finishedPlayed === 0 && <Empty text="No finished games in this range yet." />}
    </div>
  );
}
