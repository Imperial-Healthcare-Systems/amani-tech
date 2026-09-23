import s from './ScopeCards.module.css';

/** Four visuals for the GCC scope cards — one system: glass planes, silver edges, electric-blue accents. */

const NAVY = '#141A4A', NAVY_MID = '#242D78', BLUE = '#2563EB', BLUE_LIGHT = '#60A5FA', STEEL = '#C9D8FF', LAV = '#8B8FE8';

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".97" /><stop offset="1" stopColor="#DFE8FF" stopOpacity=".85" />
      </linearGradient>
      <linearGradient id={`${id}-pane`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F5F8FF" /><stop offset="1" stopColor="#D7E3FF" />
      </linearGradient>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE_LIGHT} /><stop offset="1" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={NAVY_MID} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="56%" r="52%">
        <stop offset="0" stopColor={BLUE} stopOpacity=".18" /><stop offset="1" stopColor={BLUE} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function ScopeArt({ name }: { name: string }) {
  const id = `sa-${name}`;
  const box = { viewBox: '0 0 180 120', className: s.art, role: 'presentation' as const, 'aria-hidden': true };

  // 01 — incorporation: the registration papers, stamped
  if (name === 'legal') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="90" cy="98" rx="66" ry="17" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <rect x="42" y="16" width="70" height="86" rx="7" fill="#EAF0FF" stroke={STEEL} transform="rotate(-7 77 59)" />
        <rect x="50" y="12" width="70" height="86" rx="7" fill={`url(#${id}-glass)`} stroke={STEEL} />
        <rect x="60" y="24" width="34" height="5" rx="2.5" fill={NAVY_MID} opacity=".5" />
        {[0, 1, 2, 3].map(i => <rect key={i} x="60" y={38 + i * 10} width={i === 3 ? 28 : 50} height="4" rx="2" fill={STEEL} />)}
        <rect x="60" y="80" width="24" height="7" rx="3.5" fill={BLUE_LIGHT} opacity=".5" />
      </g>
      {/* seal */}
      <g className={s.floatFast}>
        <circle cx="126" cy="74" r="20" fill={`url(#${id}-deep)`} />
        <circle cx="126" cy="74" r="14" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".6" />
        <path d="M119 74 l5 5 l10 -11" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={s.floatFast} style={{ animationDelay: '.7s' }}>
        <rect x="18" y="30" width="26" height="22" rx="6" fill="#fff" stroke={STEEL} />
        <path d="M25 41 h12 M25 46 h8" stroke={LAV} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <circle className={s.pulse} cx="150" cy="34" r="3" fill={BLUE} />
    </svg>
  );

  // 02 — the workspace: a campus of glass floors
  if (name === 'office') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="90" cy="100" rx="70" ry="16" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <path d="M90 104 L34 76 L90 48 L146 76 Z" fill={`url(#${id}-pane)`} stroke={STEEL} />
        {/* tower */}
        <path d="M74 74 L74 26 L98 14 L98 62 Z" fill={`url(#${id}-glass)`} stroke={STEEL} />
        <path d="M98 62 L98 14 L118 26 L118 74 Z" fill="#DCE6FF" stroke={STEEL} />
        {[0, 1, 2, 3].map(i => (
          <g key={i} className={s.tick} style={{ animationDelay: `${i * .4}s` }}>
            <rect x="79" y={34 + i * 10} width="14" height="5" rx="1.5" fill={BLUE_LIGHT} opacity=".65" />
            <rect x="103" y={40 + i * 10} width="11" height="5" rx="1.5" fill={BLUE} opacity=".45" />
          </g>
        ))}
        {/* low block */}
        <path d="M44 84 L44 62 L68 52 L68 74 Z" fill={`url(#${id}-glass)`} stroke={STEEL} />
        <path d="M68 74 L68 52 L84 60 L84 82 Z" fill="#D2DEFF" stroke={STEEL} />
      </g>
      <g className={s.floatFast}>
        <rect x="132" y="28" width="32" height="26" rx="7" fill="#fff" stroke={STEEL} />
        <rect x="139" y="36" width="18" height="3.5" rx="1.75" fill={BLUE} opacity=".7" />
        <rect x="139" y="43" width="11" height="3.5" rx="1.75" fill={STEEL} />
      </g>
      <circle className={s.pulse} cx="24" cy="46" r="3" fill={BLUE} />
      <circle className={s.pulse} style={{ animationDelay: '.8s' }} cx="158" cy="72" r="3" fill={LAV} />
    </svg>
  );

  // 03 — compliance: the shield over the filings
  if (name === 'compliance') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="90" cy="98" rx="64" ry="17" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <rect x="30" y="26" width="58" height="72" rx="7" fill={`url(#${id}-glass)`} stroke={STEEL} />
        {[0, 1, 2].map(i => (
          <g key={i} className={s.tick} style={{ animationDelay: `${i * .45}s` }}>
            <rect x="40" y={40 + i * 17} width="11" height="11" rx="3.5" fill={`url(#${id}-blue)`} />
            <path d={`M43 ${45.5 + i * 17} l2.5 2.5 l3.5 -4.5`} stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="57" y={42 + i * 17} width="22" height="3.5" rx="1.75" fill={STEEL} />
            <rect x="57" y={48 + i * 17} width="14" height="3.5" rx="1.75" fill="#E2EAFF" />
          </g>
        ))}
      </g>
      <g className={s.floatFast}>
        <path d="M122 22 L152 34 v26 c0 18 -13 29 -30 35 c-17 -6 -30 -17 -30 -35 V34 Z" fill={`url(#${id}-deep)`} />
        <path d="M122 22 L152 34 v26 c0 18 -13 29 -30 35 Z" fill={NAVY} opacity=".3" />
        <path d="M112 58 l7 7 l14 -16" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle className={s.pulse} cx="164" cy="30" r="3" fill={BLUE} />
    </svg>
  );

  // 04 — the team: leadership first, then the org around it
  return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="90" cy="100" rx="68" ry="16" fill={`url(#${id}-glow)`} />
      <g stroke="#B9CCFF" strokeWidth="1.4" fill="none">
        <path d="M90 52 v14 M56 82 v-10 h68 v10" />
      </g>
      <g className={s.floatSlow}>
        <circle cx="90" cy="32" r="16" fill={`url(#${id}-deep)`} />
        <path d="M68 68 a22 22 0 0 1 44 0 Z" fill={`url(#${id}-deep)`} />
      </g>
      {[[44, 84], [90, 84], [136, 84]].map(([cx, cy], i) => (
        <g key={i} className={s.floatFast} style={{ animationDelay: `${i * .45}s` }}>
          <circle cx={cx} cy={cy} r="11" fill={i === 1 ? `url(#${id}-blue)` : `url(#${id}-glass)`} stroke={STEEL} />
          <path d={`M${Number(cx) - 15} 112 a15 15 0 0 1 30 0 Z`} fill={i === 1 ? `url(#${id}-blue)` : `url(#${id}-glass)`} stroke={STEEL} />
        </g>
      ))}
      <g className={s.floatFast} style={{ animationDelay: '.2s' }}>
        <rect x="128" y="18" width="42" height="28" rx="7" fill="#fff" stroke={STEEL} />
        <circle cx="140" cy="32" r="6" fill={LAV} opacity=".8" />
        <rect x="150" y="27" width="14" height="3.5" rx="1.75" fill={STEEL} />
        <rect x="150" y="34" width="9" height="3.5" rx="1.75" fill="#E2EAFF" />
      </g>
      <circle className={s.pulse} cx="18" cy="46" r="3" fill={BLUE} />
      <circle className={s.pulse} style={{ animationDelay: '.7s' }} cx="166" cy="66" r="3" fill={BLUE} />
    </svg>
  );
}
