import type { Approach, Format, Mode, Outcome, StarPlay, Tier } from '../types';

// Keep these in sync with src/config/balance.ts on the server

export const REFERRAL_STARS = 5;
export const REFERRAL_MIN_GAMES = 2; // the friend must finish this many real (non-solo) games first
export const COMEBACK_STARS = 1; // the free daily star for a player who is out of stars

// What a game costs to start, and the TOTAL a winner gets back (the entry comes back inside it).
export const ENTRY_COST = { solo: 1, duel: 2, coop: 2 } as const;
export const PAYOUT = { solo: 1, duel: 3, coop: 3 } as const;
export const entryKind = (m: { mode: Mode; solo?: boolean }): keyof typeof ENTRY_COST => (m.solo ? 'solo' : m.mode === 'coop' ? 'coop' : 'duel');

export const APPROACHES: Record<Approach, { label: string; emoji: string }> = {
  charm: { label: 'Charm', emoji: '😎' },
  hustle: { label: 'Hustle', emoji: '💪🏾' },
  gragra: { label: 'Gragra', emoji: '🗣️' },
  wisdom: { label: 'Wisdom', emoji: '🧠' },
};

export const TIERS: Record<Tier, { label: string; emoji: string; text: string; chip: string }> = {
  disaster: { label: 'Big miss', emoji: '💥', text: 'text-danger', chip: 'bg-danger/15 border-danger/40 text-danger' },
  struggle: { label: 'Almost', emoji: '😬', text: 'text-orange-300', chip: 'bg-orange-400/15 border-orange-400/40 text-orange-300' },
  win: { label: 'Success', emoji: '✅', text: 'text-brand', chip: 'bg-brand/15 border-brand/40 text-brand' },
  legendary: { label: 'Perfect', emoji: '🌟', text: 'text-gold', chip: 'bg-gold/15 border-gold/40 text-gold' },
};

// Only very high or very low dice get a tag. Everything in between is just a number.
export const LUCK = {
  high: { label: 'Lucky roll', emoji: '🍀', chip: 'bg-gold/15 border-gold/40 text-gold' },
  low: { label: 'Bad luck', emoji: '😬', chip: 'bg-danger/15 border-danger/40 text-danger' },
} as const;

export const STAR_PLAYS: Record<StarPlay, { label: string; cost: number; blurb: string }> = {
  reroll: { label: 'Reroll', cost: 1, blurb: 'Roll again and keep the higher number' },
  nudge: { label: 'Nudge', cost: 2, blurb: 'Add 2 to your roll' },
  shield: { label: 'Shield', cost: 2, blurb: 'Not available right now' },
};



export const MODE_CARDS: { id: string; mode: Mode; format: Format; name: string; tag: string; blurb: string; solo?: boolean }[] = [
  
  {id: 'solo', mode: 'coop', format: '1v1', name: 'Solo', tag: '1 player', blurb: 'Play the story on your own.', solo: true},
  { id: 'rival-1v1', mode: 'rival', format: '1v1', name: 'Face Off', tag: '1v1', blurb: 'You against one player. The higher roll wins the scene.' },
  { id: 'coop-1v1', mode: 'coop', format: '1v1', name: 'Link Up', tag: '1v1 co-op', blurb: 'You and a friend team up to face the challenge.' },
  /*
  { id: 'team-2v2', mode: 'team', format: '2v2', name: 'Team Battle', tag: '2v2', blurb: 'Two teams of two. The team with the better rolls wins the scene.' },
  { id: 'coop-2v2', mode: 'coop', format: '2v2', name: 'Full Squad', tag: '2v2 co-op', blurb: 'Four players team up to beat one big problem.' },
   */
];

export const OUTCOME_COPY: Record<Outcome, { title: string; emoji: string; color: string }> = {
  win: { title: 'You won!', emoji: '🏆', color: 'text-gold' },
  loss: { title: 'You lost this time', emoji: '😤', color: 'text-danger' },
  draw: { title: 'It is a tie', emoji: '🤝', color: 'text-sky' },
  success: { title: 'You made it!', emoji: '🎉', color: 'text-brand' },
  fail: { title: 'Better luck next time', emoji: '💀', color: 'text-danger' },
};

export const RARITY_COLOR: Record<string, string> = {
  common: 'text-mute',
  rare: 'text-sky',
  epic: 'text-fuchsia-300',
};