export type Approach = 'charm' | 'gragra' | 'lie' | 'wisdom';
export type Tier = 'disaster' | 'struggle' | 'win' | 'legendary';
export type Mode = 'rival' | 'coop' | 'team';
export type Format = '1v1' | '2v2';
export type StarPlay = 'reroll' | 'nudge' | 'shield';
export type Look = Record<string, string>;

export type PlayerRecord = { score: number; wins: number; losses: number; encounters_played: number };

export type Profile = {
  id: string;
  username: string;
  avatar: Look;
  title: string | null;
  is_guest: boolean;
  stars: number;
  streak: number;
  last_played_on: string | null;
  referral_code: string;
  stats: Record<Approach, number>;
  record: PlayerRecord | null;
};
export type PublicProfile = Pick<Profile, 'username' | 'avatar' | 'title' | 'streak' | 'record'>;

export type TopPlayer = { rank: number; username: string; avatar: Look; score: number; wins: number };
export type Landing = { liveUsers: number; totalVisits: number; topPlayers: TopPlayer[] };
export type Daily = { date: string; scenario: { id: string; title: string; tagline: string; modes: Mode[] } };


export type Outcome = 'win' | 'loss' | 'draw' | 'success' | 'fail';

export type InviteInfo = {
  code: string;
  mode: Mode;
  format: Format;
  status: string;
  seatsLeft: number;
  host: string | null;
  scenario: { title: string; tagline: string };
};

export type Pack = { id: string; stars: number; priceNaira: number };
export type AvatarItem = {
  id: string;
  slot: 'body' | 'outfit' | 'headwear' | 'shoes';
  name: string;
  rarity: string;
  price_stars: number;
};

export type ChatPerson = { id: string; username: string; avatar: Look };
export type ChatRequest = { id: string; createdAt: string; from: ChatPerson };

export type Message = { id: number; sender_id: string; body: string; created_at: string };



export type Kind = 'decisive' | 'both_succeed' | 'both_fail' | 'tie' | 'all_pass' | 'mixed' | 'all_fail';
export type Standing = 'won' | 'lost' | 'level' | 'crew';
export type Status = { mod: number; label: string } | null;

export type RoomPlayer = { userId: string; username: string; avatar: Look; team: number; acted: boolean; marks: MarkInfo[]; bonusKept: boolean };
export type BonusInfo = { label: string; stars: number; points: number };
export type RoomState = {
  id: string;
  code: string | null;
  mode: Mode;
  format: Format;
  status: 'waiting' | 'active' | 'finished';
  capacity: number;
  round: number;
  maxRounds: number;
  roundSeconds: number;
    phase: Phase;
  edgeSeconds: number;
  remainingMs: number | null;
  recap: string | null;
  world: MarkInfo[]
  win: { points: number; stars: number };
  wins: Record<number, number> | null; // scenes won per team (duels only)
  bonus: BonusInfo | null;
  scenario: { id: string; title: string; tagline: string };
  scene: null | {
    key: string;
    title: string;
    text: string;
    stakes: string | null;
    twists: string[]
    choices: SceneChoice[]
  };
  players: RoomPlayer[];
};
export type RollRow = {
  userId: string;
  team: number;
  round: number;
  sceneKey: string;
  approach: Approach;
  starPlay: StarPlay | null;
  die: number;
  dice: number[]; 
  shielded: boolean;
  modifier: number;
  starBonus: number;
  total: number;
  tier: Tier;
  standing: Standing;
};
export type RoundResult = {
  round: number;
  rolls: RollRow[];
  kind: Kind;
  same: boolean;
  winnerTeam: number | null;
  headline: string;
  gained: Gained[]
  lead: { userId: string; approach: Approach } | null
  bonusLost?: string[];
  bonusLostMessage?: string | null;
  tieRounds?: { userId: string; die: number }[][]; // re-rolls used to break a tie on the top roll
  ends: boolean;
  revealMs: number;
};
export type FinishedPayload = {
  roomId: string;
  mode: Mode;
  results: {
    userId: string;
    username: string;
    team: number;
    result: Outcome;
    points: number;
    stars: number;
    capped: boolean;
    bonus: 'earned' | 'missed' | null;
  }[];
  decider?: { team: number; die: number }[][]; // one die per side when the scenes ended level
  bonus?: { label: string; earnedLine: string; lostMessage: string } | null;
  endings: Partial<Record<Outcome, string>>;
  story: string[] 
  epilogue: string[]
};
export type Conversation = { id: string; with: ChatPerson; last: Message | null };

export type Phase = 'choose' | 'edge' | 'reveal';
export type EdgeOption = { id: StarPlay; cost: number; usable: boolean };
export type PrivateRoll = {
  round: number;
  approach: Approach;
  die: number;
  dice: number[];
  modifier: number;
  starBonus: number;
  total: number;
  tier: Tier;
  shielded: boolean;
  stars: number;
  used: StarPlay | null;
  done: boolean;
  edges: EdgeOption[];
  remainingMs: number | null;
};
export type MarkInfo = { id: string; label: string; tip: string };
export type MarkWho = 'self' | 'rival' | 'world';
export type SceneChoice = {
  approach: Approach;
  label: string;
  mods: { mark: string; who: MarkWho; delta: number; label: string }[];
  lock: { mark: string; who: MarkWho; reason: string } | null;
};
export type Gained = { userId: string | null; mark: string; label: string; tip: string };