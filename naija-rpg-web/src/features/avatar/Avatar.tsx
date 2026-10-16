import type { Look } from '@/types';

const SKIN = '#8a5a3c';
const DEFAULT: Look = { body: 'body_1', outfit: 'outfit_tee', headwear: 'headwear_cap', shoes: 'shoes_sneakers' };

export function Avatar({
  look,
  size = 96,
  crop = 'full',
  className,
}: {
  look?: Look | null;
  size?: number;
  crop?: 'full' | 'bust';
  className?: string;
}) {
  const l = { ...DEFAULT, ...(look ?? {}) };
  const bust = crop === 'bust';
  const fabric = l.outfit === 'outfit_ankara' ? 'url(#nrpg-ankara)' : '#1fc77e';
  const pants = l.outfit === 'outfit_ankara' ? 'url(#nrpg-ankara)' : '#26324f';

  return (
    <svg
      viewBox={bust ? '22 -4 76 76' : '0 0 120 150'}
      width={size}
      height={bust ? size : size * 1.25}
      className={className}
      role="img"
      aria-label="Player avatar"
    >
      <defs>
        <pattern id="nrpg-ankara" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#ffb703" />
          <circle cx="6" cy="6" r="3" fill="#e63946" />
          <path d="M0 12L12 0" stroke="#1d3557" strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* legs */}
      <rect x="44" y="108" width="13" height="26" rx="5" fill={SKIN} />
      <rect x="63" y="108" width="13" height="26" rx="5" fill={SKIN} />

      {/* outfit */}
      {l.outfit === 'outfit_agbada' ? (
        <g>
          <path d="M34 68 Q60 60 86 68 L106 132 L14 132 Z" fill="#2748b5" />
          <path d="M52 66 L68 66 L72 132 L48 132 Z" fill="#f5f1e6" />
          <path d="M52 66 L48 132 M68 66 L72 132" stroke="#ffc233" strokeWidth="2.5" fill="none" />
          <path d="M34 68 L8 112 L30 118 L40 84Z" fill="#2748b5" />
          <path d="M86 68 L112 112 L90 118 L80 84Z" fill="#2748b5" />
        </g>
      ) : (
        <g>
          <rect x="43" y="104" width="14" height="28" rx="5" fill={pants} />
          <rect x="63" y="104" width="14" height="28" rx="5" fill={pants} />
          <rect x="24" y="72" width="11" height="34" rx="5.5" fill={SKIN} />
          <rect x="85" y="72" width="11" height="34" rx="5.5" fill={SKIN} />
          <path d="M36 70 Q60 62 84 70 L82 112 L38 112 Z" fill={fabric} />
          <rect x="22" y="70" width="14" height="14" rx="6" fill={fabric} />
          <rect x="84" y="70" width="14" height="14" rx="6" fill={fabric} />
        </g>
      )}

      {/* shoes */}
      {l.shoes === 'shoes_slippers' ? (
        <g fill="#2f6fed">
          <rect x="40" y="136" width="20" height="5" rx="2.5" />
          <rect x="60" y="136" width="20" height="5" rx="2.5" />
          <rect x="44" y="131" width="12" height="5" rx="2" />
          <rect x="64" y="131" width="12" height="5" rx="2" />
        </g>
      ) : (
        <g>
          <rect x="39" y="130" width="22" height="11" rx="5" fill="#f5f5f5" />
          <rect x="59" y="130" width="22" height="11" rx="5" fill="#f5f5f5" />
          <rect x="39" y="137" width="22" height="4" rx="2" fill="#1fc77e" />
          <rect x="59" y="137" width="22" height="4" rx="2" fill="#1fc77e" />
        </g>
      )}

      {/* head */}
      <rect x="53" y="56" width="14" height="16" rx="5" fill={SKIN} />
      <circle cx="38" cy="42" r="4" fill={SKIN} />
      <circle cx="82" cy="42" r="4" fill={SKIN} />
      <circle cx="60" cy="40" r="22" fill={SKIN} />
      <circle cx="52" cy="40" r="2.6" fill="#1a1a1a" />
      <circle cx="68" cy="40" r="2.6" fill="#1a1a1a" />
      <path d="M52 49 Q60 56 68 49" stroke="#1a1a1a" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* headwear */}
      {l.headwear === 'headwear_gele' ? (
        <g>
          <path d="M34 38 Q26 8 56 8 Q70 -2 84 12 Q96 20 86 38 Q60 28 34 38Z" fill="#d6336c" />
          <path d="M40 30 Q60 18 80 28" stroke="#ffc233" strokeWidth="2.5" fill="none" />
          <path d="M44 20 Q62 10 78 18" stroke="#ffd6e7" strokeWidth="2" fill="none" />
        </g>
      ) : (
        <g>
          <path d="M38 36 Q38 12 60 12 Q82 12 82 36 Z" fill="#1c2733" />
          <path d="M60 34 H96 Q99 38 92 40 H60 Z" fill="#111a24" />
          <circle cx="60" cy="22" r="3" fill="#1fc77e" />
        </g>
      )}
    </svg>
  );
}