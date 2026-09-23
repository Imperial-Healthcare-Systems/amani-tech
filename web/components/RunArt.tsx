import s from './RunJourney.module.css';

/** Five stage visuals for the GCC lifecycle — one system: glass planes, silver edges, blueprint and
 *  electric blue, navy for weight. Static on purpose: this section moves only when the reader acts. */

const NAVY = '#141A4A', NAVY_MID = '#242D78', BLUE = '#2563EB', BLUE_LIGHT = '#60A5FA', STEEL = '#C9D8FF';

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".97" /><stop offset="1" stopColor="#DCE6FF" stopOpacity=".86" />
      </linearGradient>
      <linearGradient id={`${id}-pane`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F6F9FF" /><stop offset="1" stopColor="#D5E1FF" />
      </linearGradient>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE_LIGHT} /><stop offset="1" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={NAVY_MID} />
      </linearGradient>
      <linearGradient id={`${id}-print`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6F9CF3" /><stop offset="1" stopColor="#2A5BD7" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={BLUE} stopOpacity=".2" /><stop offset="1" stopColor={BLUE} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** An isometric box: front corner (x, y), half-width w, rise h, depth d. */
function Box({ x, y, w, h, d = w / 2, left, right, top, stroke = STEEL }: { x: number; y: number; w: number; h: number; d?: number; left: string; right: string; top: string; stroke?: string }) {
  return (
    <g>
      <path d={`M${x - w} ${y - d} L${x} ${y} L${x} ${y - h} L${x - w} ${y - d - h} Z`} fill={left} stroke={stroke} strokeWidth=".8" />
      <path d={`M${x} ${y} L${x + w} ${y - d} L${x + w} ${y - d - h} L${x} ${y - h} Z`} fill={right} stroke={stroke} strokeWidth=".8" />
      <path d={`M${x - w} ${y - d - h} L${x} ${y - h} L${x + w} ${y - d - h} L${x} ${y - 2 * d - h} Z`} fill={top} stroke={stroke} strokeWidth=".8" />
    </g>
  );
}

export function RunArt({ name }: { name: string }) {
  const id = `ra-${name}`;
  const box = { viewBox: '0 0 200 130', className: s.art, role: 'presentation' as const, 'aria-hidden': true };

  // 01 — Plan: the blueprint on the table, the roadmap floating above it
  if (name === 'plan') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="110" rx="84" ry="16" fill={`url(#${id}-glow)`} />
      <path d="M22 88 L96 58 L176 84 L102 116 Z" fill={`url(#${id}-print)`} opacity=".93" />
      <g stroke="#fff" strokeOpacity=".3" strokeWidth=".8">
        {[.2, .4, .6, .8].map(t => <path key={`a${t}`} d={`M${22 + 74 * t} ${88 - 30 * t} L${102 + 74 * t} ${116 - 32 * t}`} />)}
        {[.25, .5, .75].map(u => <path key={`b${u}`} d={`M${22 + 80 * u} ${88 + 28 * u} L${96 + 80 * u} ${58 + 26 * u}`} />)}
      </g>
      <path d="M70 90 L104 76 L128 84 L94 99 Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeOpacity=".85" />
      <path d="M94 99 L104 76" stroke="#fff" strokeWidth="1.2" strokeOpacity=".6" />
      {/* the rolled edge */}
      <path d="M18 90 L92 60" stroke={`url(#${id}-deep)`} strokeWidth="11" strokeLinecap="round" />
      <path d="M18 87 L92 57" stroke="#A9C6FF" strokeWidth="2.6" strokeLinecap="round" opacity=".75" />
      {/* the pen */}
      <path d="M130 106 L166 91" stroke={NAVY} strokeWidth="5" strokeLinecap="round" />
      <path d="M156 95 L163 92" stroke={BLUE_LIGHT} strokeWidth="5" />
      <path d="M125 108 l7 -1 l-3 -4 z" fill={NAVY} />
      {/* the roadmap panel */}
      <rect x="112" y="12" width="68" height="48" rx="8" fill={`url(#${id}-glass)`} stroke={STEEL} />
      <rect x="121" y="20" width="26" height="4" rx="2" fill={NAVY_MID} opacity=".45" />
      <rect x="122" y="42" width="8" height="11" rx="2" fill={`url(#${id}-blue)`} />
      <rect x="134" y="36" width="8" height="17" rx="2" fill={`url(#${id}-blue)`} />
      <rect x="146" y="30" width="8" height="23" rx="2" fill={`url(#${id}-deep)`} />
      <path d="M158 44 L166 36 L172 39" stroke={BLUE} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // 02 — Establish: the building stands, with the entity papers and the compliance shield
  if (name === 'establish') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="110" rx="84" ry="16" fill={`url(#${id}-glow)`} />
      <path d="M96 122 L30 96 L96 70 L162 96 Z" fill={`url(#${id}-pane)`} stroke={STEEL} strokeWidth=".8" />
      <Box x={64} y={106} w={20} h={22} d={9} left={`url(#${id}-glass)`} right="#D3DFFF" top="#EEF3FF" />
      <Box x={104} y={100} w={22} h={70} d={10} left={`url(#${id}-glass)`} right="#CFDCFF" top="#F1F5FF" />
      <g stroke={BLUE_LIGHT} strokeWidth="2.6" opacity=".7">
        {[0, 1, 2, 3, 4].map(r => <path key={`l${r}`} d={`M85 ${48 + r * 11} L101 ${56 + r * 11}`} />)}
      </g>
      <g stroke={BLUE} strokeWidth="2.6" opacity=".45">
        {[0, 1, 2, 3, 4].map(r => <path key={`r${r}`} d={`M107 ${56 + r * 11} L123 ${48 + r * 11}`} />)}
      </g>
      <g stroke={BLUE_LIGHT} strokeWidth="2.2" opacity=".6">
        {[0, 1].map(r => <path key={`s${r}`} d={`M47 ${90 + r * 7} L61 ${97 + r * 7}`} />)}
      </g>
      {/* entity papers */}
      <rect x="140" y="62" width="30" height="36" rx="5" fill={`url(#${id}-glass)`} stroke={STEEL} />
      {[0, 1, 2].map(i => <rect key={i} x="146" y={70 + i * 7} width={i === 2 ? 11 : 18} height="3" rx="1.5" fill={STEEL} />)}
      {/* compliance shield */}
      <path d="M156 14 L174 21 v13 c0 11 -8 18 -18 21 c-10 -3 -18 -10 -18 -21 V21 Z" fill={`url(#${id}-deep)`} />
      <path d="M148 34 l5 5 l10 -11" stroke="#fff" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // 03 — Staff: leadership first, the team around it, a profile in review
  if (name === 'staff') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="110" rx="84" ry="16" fill={`url(#${id}-glow)`} />
      <path d="M100 124 L36 98 L100 72 L164 98 Z" fill={`url(#${id}-pane)`} stroke={STEEL} strokeWidth=".8" />
      <g stroke="#B9CCFF" strokeWidth="1.3" strokeDasharray="3 4" fill="none">
        <path d="M82 60 L70 62" /><path d="M118 60 L130 62" />
      </g>
      {[[66, 62], [134, 62]].map(([cx, cy]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r="11" fill={`url(#${id}-glass)`} stroke={STEEL} />
          <path d={`M${cx - 18} 104 a18 18 0 0 1 36 0 Z`} fill={`url(#${id}-glass)`} stroke={STEEL} />
        </g>
      ))}
      <circle cx="100" cy="46" r="15" fill={`url(#${id}-deep)`} />
      <path d="M100 38 a8 8 0 0 1 7 4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
      <path d="M76 108 a24 24 0 0 1 48 0 Z" fill={`url(#${id}-deep)`} />
      {/* profile in review */}
      <rect x="130" y="10" width="56" height="36" rx="8" fill="#fff" stroke={STEEL} />
      <circle cx="144" cy="28" r="7" fill={`url(#${id}-blue)`} />
      <rect x="155" y="22" width="24" height="4" rx="2" fill={STEEL} />
      <rect x="155" y="30" width="16" height="4" rx="2" fill="#E2EAFF" />
    </svg>
  );

  // 04 — Operate: the running center — dashboards, payroll, cloud and servers
  if (name === 'operate') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="110" rx="84" ry="16" fill={`url(#${id}-glow)`} />
      <rect x="26" y="30" width="96" height="62" rx="6" fill={NAVY} />
      <rect x="31" y="35" width="86" height="52" rx="3" fill={`url(#${id}-deep)`} />
      <rect x="39" y="43" width="30" height="4" rx="2" fill="#fff" opacity=".85" />
      <rect x="39" y="52" width="20" height="3" rx="1.5" fill="#fff" opacity=".45" />
      {[[40, 12], [50, 19], [60, 14], [70, 24]].map(([x, h]) => <rect key={x} x={x} y={80 - h} width="7" height={h} rx="2" fill={BLUE_LIGHT} opacity=".9" />)}
      <path d="M84 72 L94 62 L102 66 L111 52" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
      <path d="M14 98 h120 l-10 12 h-100 Z" fill={`url(#${id}-glass)`} stroke={STEEL} />
      <g stroke="#B9CCFF" strokeWidth="1.3" strokeDasharray="3 4" fill="none"><path d="M122 62 L140 70" /></g>
      <Box x={162} y={112} w={20} h={12} d={9} left={`url(#${id}-glass)`} right="#CFDCFF" top="#EEF3FF" />
      <Box x={162} y={98} w={20} h={12} d={9} left={`url(#${id}-glass)`} right="#CFDCFF" top="#EEF3FF" />
      <circle cx="150" cy="101" r="1.8" fill={BLUE} /><circle cx="150" cy="87" r="1.8" fill={BLUE} />
      <path d="M142 58 a13 13 0 0 1 25 -6 a10 10 0 0 1 16 6 a9 9 0 0 1 -2 18 h-35 a10 10 0 0 1 -4 -18 Z" fill={`url(#${id}-blue)`} opacity=".92" />
      <path d="M153 52 a9 9 0 0 1 12 -2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
    </svg>
  );

  // 05 — Transition: records and people move across to the center you now run yourself
  return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="100" cy="110" rx="84" ry="16" fill={`url(#${id}-glow)`} />
      <rect x="20" y="40" width="44" height="58" rx="6" fill="#E8EFFF" stroke={STEEL} transform="rotate(-6 42 69)" />
      <rect x="28" y="36" width="44" height="58" rx="6" fill={`url(#${id}-glass)`} stroke={STEEL} />
      <rect x="36" y="46" width="22" height="4" rx="2" fill={NAVY_MID} opacity=".45" />
      {[0, 1, 2, 3].map(i => <rect key={i} x="36" y={56 + i * 8} width={i === 3 ? 16 : 28} height="3" rx="1.5" fill={STEEL} />)}
      <path d="M80 60 h26 v-10 l22 17 l-22 17 v-10 h-26 Z" fill={`url(#${id}-blue)`} />
      <path d="M82 62 h22" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      <Box x={164} y={110} w={22} h={56} d={10} left={`url(#${id}-glass)`} right="#CFDCFF" top="#F1F5FF" />
      <g stroke={BLUE_LIGHT} strokeWidth="2.4" opacity=".7">
        {[0, 1, 2, 3].map(r => <path key={r} d={`M145 ${68 + r * 10} L161 ${76 + r * 10}`} />)}
      </g>
      <circle cx="180" cy="30" r="12" fill={`url(#${id}-deep)`} />
      <path d="M174 30 l4 4 l8 -9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
