import s from './EngageJourney.module.css';

/** Four stage visuals for "How we engage" — one illustration system: glass planes, silver edges,
 *  electric-blue accents. Inline SVG, so there is nothing to download and the idle motion is CSS. */

const NAVY = '#0B2A5F', NAVY_MID = '#134087', BLUE = '#0091FF', BLUE_LIGHT = '#5CB8FF', STEEL = '#C9E6FF';

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".96" /><stop offset="1" stopColor="#DFF0FF" stopOpacity=".82" />
      </linearGradient>
      <linearGradient id={`${id}-pane`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F4FBFF" /><stop offset="1" stopColor="#D8EEFF" />
      </linearGradient>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE_LIGHT} /><stop offset="1" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={NAVY_MID} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="58%" r="52%">
        <stop offset="0" stopColor={BLUE} stopOpacity=".16" /><stop offset="1" stopColor={BLUE} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function EngageArt({ name }: { name: string }) {
  const id = `ea-${name}`;
  const box = { viewBox: '0 0 200 140', className: s.art, role: 'presentation' as const, 'aria-hidden': true };

  // 01 — Discovery: a magnifier passing over system documents
  if (name === 'discovery') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="112" rx="76" ry="20" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <path d="M100 118 L44 92 L100 66 L156 92 Z" fill={`url(#${id}-pane)`} stroke={STEEL} />
        <path d="M100 100 L62 82 L100 64 L138 82 Z" fill="#fff" opacity=".9" stroke={STEEL} />
        <g stroke={STEEL} strokeWidth="1">
          <path d="M76 82 l20 -9 M86 88 l22 -10 M96 94 l20 -9" />
        </g>
        <rect x="118" y="88" width="16" height="10" rx="2" fill={BLUE_LIGHT} opacity=".55" />
      </g>
      <g className={s.floatFast}>
        <circle cx="112" cy="58" r="27" fill="#fff" opacity=".6" />
        <circle cx="112" cy="58" r="27" fill="none" stroke={`url(#${id}-deep)`} strokeWidth="5" />
        <circle cx="112" cy="58" r="20" fill={BLUE_LIGHT} opacity=".14" />
        <path d="M131 78 l18 18" stroke={NAVY} strokeWidth="7" strokeLinecap="round" />
        <path d="M100 52 a14 14 0 0 1 12 -8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".9" />
      </g>
      <circle className={s.pulse} cx="48" cy="56" r="3" fill={BLUE} />
      <circle className={s.pulse} style={{ animationDelay: '.8s' }} cx="166" cy="72" r="3" fill={BLUE} />
    </svg>
  );

  // 02 — Proposal: a scoped plan on screen, with a cost/timeline chart
  if (name === 'proposal') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="116" rx="72" ry="18" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <rect x="42" y="26" width="108" height="76" rx="8" fill={`url(#${id}-glass)`} stroke={STEEL} />
        <rect x="54" y="38" width="40" height="5" rx="2.5" fill={NAVY_MID} opacity=".55" />
        {[0, 1, 2, 3].map(i => <rect key={i} x="54" y={50 + i * 9} width={i === 3 ? 30 : 46} height="4" rx="2" fill={STEEL} />)}
        {[[104, 24, 0], [117, 36, .2], [130, 18, .4]].map(([x, h, d], i) => (
          <rect key={i} className={s.bar} style={{ animationDelay: `${d}s`, transformOrigin: `${Number(x) + 4}px 88px` }}
            x={x} y={88 - Number(h)} width="9" height={h} rx="2.5" fill={i === 1 ? `url(#${id}-deep)` : `url(#${id}-blue)`} />
        ))}
        <path d="M74 110 h52 l-7 8 h-38 Z" fill={`url(#${id}-pane)`} stroke={STEEL} />
        <rect x="86" y="102" width="28" height="8" fill="#E5F4FF" stroke={STEEL} />
      </g>
      <g className={s.floatFast}>
        <rect x="140" y="22" width="44" height="26" rx="7" fill="#fff" stroke={STEEL} />
        <path d="M148 35 h12 M148 41 h20" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
        <circle className={s.pulse} cx="176" cy="30" r="3.5" fill={BLUE} />
      </g>
      <g className={s.floatFast} style={{ animationDelay: '.7s' }}>
        <rect x="14" y="62" width="30" height="22" rx="6" fill="#fff" stroke={STEEL} />
        <path d="M22 73 l4 4 l8 -9" stroke={BLUE} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );

  // 03 — Build: modular blocks assembled into an architecture, with the delivery cadence beside it
  if (name === 'build') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="94" cy="116" rx="74" ry="19" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        {[[64, 78, .32], [98, 60, .5], [64, 44, .18], [98, 26, .28]].map(([x, y, op], i) => (
          <g key={i} className={s.block} style={{ animationDelay: `${i * .35}s` }}>
            <path d={`M${x} ${Number(y) + 28} L${Number(x) - 26} ${Number(y) + 14} L${x} ${y} L${Number(x) + 26} ${Number(y) + 14} Z`} fill={i % 2 ? `url(#${id}-blue)` : `url(#${id}-pane)`} opacity={i % 2 ? .95 : 1} stroke={STEEL} />
            <path d={`M${Number(x) - 26} ${Number(y) + 14} L${x} ${Number(y) + 28} L${x} ${Number(y) + 44} L${Number(x) - 26} ${Number(y) + 30} Z`} fill={i % 2 ? BLUE : '#E4F3FF'} opacity={Number(op) + .45} />
            <path d={`M${Number(x) + 26} ${Number(y) + 14} L${x} ${Number(y) + 28} L${x} ${Number(y) + 44} L${Number(x) + 26} ${Number(y) + 30} Z`} fill={i % 2 ? NAVY_MID : '#D2E9FF'} opacity={Number(op) + .5} />
          </g>
        ))}
      </g>
      <g className={s.floatFast}>
        {['Plan', 'Build', 'Test'].map((t, i) => (
          <g key={t} className={s.tick} style={{ animationDelay: `${i * .5}s` }}>
            <rect x="140" y={30 + i * 24} width="50" height="18" rx="9" fill="#fff" stroke={STEEL} />
            <text x="165" y={42 + i * 24} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill={NAVY_MID}>{t}</text>
          </g>
        ))}
      </g>
      <circle className={s.pulse} cx="24" cy="52" r="3" fill={BLUE} />
    </svg>
  );

  // 04 — Handover: the product live, documented, with support in place
  return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="116" rx="74" ry="18" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <rect x="46" y="28" width="108" height="68" rx="7" fill={NAVY} />
        <rect x="51" y="33" width="98" height="58" rx="4" fill={`url(#${id}-deep)`} />
        <circle cx="100" cy="54" r="13" fill="#fff" />
        <path d="M94 54 l4.5 4.5 l8 -9" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="100" y="78" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#fff" opacity=".92">Go Live</text>
        <path d="M30 104 h140 l-9 10 h-122 Z" fill={`url(#${id}-glass)`} stroke={STEEL} />
      </g>
      <g className={s.floatFast}>
        <rect x="150" y="24" width="38" height="30" rx="7" fill="#fff" stroke={STEEL} />
        <path d="M158 36 h18 M158 43 h12" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g className={s.floatFast} style={{ animationDelay: '.6s' }}>
        <rect x="12" y="52" width="32" height="26" rx="7" fill="#fff" stroke={STEEL} />
        <circle cx="28" cy="62" r="5" fill={BLUE} opacity=".8" />
        <path d="M20 74 a8 8 0 0 1 16 0 Z" fill={BLUE} opacity=".55" />
      </g>
      <circle className={s.pulse} cx="176" cy="66" r="3" fill={BLUE} />
      <circle className={s.pulse} style={{ animationDelay: '.9s' }} cx="22" cy="34" r="3" fill={BLUE} />
    </svg>
  );
}
