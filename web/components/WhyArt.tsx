import s from './WhyCards.module.css';

/** Four enterprise visuals for the "Why Amani Tech" cards: translucent, isometric, blue on white.
 *  Inline SVG — no image requests, and the idle motion is CSS so it costs nothing at runtime. */

const NAVY = '#141A4A', NAVY_MID = '#242D78', BLUE = '#2563EB', BLUE_LIGHT = '#60A5FA', LAV = '#8B8FE8';

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".95" /><stop offset="1" stopColor="#DCE6FF" stopOpacity=".8" />
      </linearGradient>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE_LIGHT} /><stop offset="1" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={NAVY_MID} />
      </linearGradient>
      <linearGradient id={`${id}-lav`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#C7CBFF" /><stop offset="1" stopColor={LAV} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="50%">
        <stop offset="0" stopColor={BLUE} stopOpacity=".22" /><stop offset="1" stopColor={BLUE} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function WhyArt({ name }: { name: string }) {
  const id = `wa-${name}`;
  const box = { viewBox: '0 0 240 150', className: s.art, role: 'presentation' as const, 'aria-hidden': true };

  // 01 — enterprise growth: a rising chart on a glass platform, with a small dashboard panel
  if (name === 'growth') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="112" cy="104" rx="92" ry="34" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        {[[70, 34, 0], [88, 52, .15], [106, 72, .3], [124, 46, .45]].map(([x, h, d], i) => (
          <g key={i} className={s.bar} style={{ animationDelay: `${d}s`, transformOrigin: `${Number(x) + 8}px 96px` }}>
            <rect x={x} y={96 - Number(h)} width="15" height={h} rx="3" fill={i === 2 ? `url(#${id}-deep)` : `url(#${id}-blue)`} opacity={i === 2 ? 1 : .82} />
            <rect x={x} y={96 - Number(h)} width="15" height="5" rx="2.5" fill="#fff" opacity=".45" />
          </g>
        ))}
        <path d="M60 104 L112 78 L164 104 L112 130 Z" fill={`url(#${id}-glass)`} stroke="#C9D8FF" strokeWidth="1" opacity=".9" />
      </g>
      <g className={s.floatFast}>
        <rect x="150" y="34" width="56" height="44" rx="9" fill="#fff" stroke="#C9D8FF" />
        <path d="M158 66 L170 54 L180 60 L196 42" stroke={BLUE} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle className={s.pulse} cx="196" cy="42" r="3.5" fill={BLUE} />
        <rect x="158" y="42" width="18" height="3" rx="1.5" fill="#C9D8FF" />
      </g>
      <g className={s.floatFast} style={{ animationDelay: '.8s' }}>
        <rect x="30" y="52" width="30" height="26" rx="7" fill="#fff" stroke="#C9D8FF" />
        <path d="M38 66 h14 M38 60 h9" stroke={LAV} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );

  // 02 — senior people: abstract figures plus a profile card
  if (name === 'people') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="108" cy="104" rx="92" ry="32" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        {[[66, 76, 15, `url(#${id}-glass)`], [136, 74, 15, `url(#${id}-lav)`]].map(([cx, cy, r, fill], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={fill as string} stroke="#C9D8FF" />
            <path d={`M${Number(cx) - 21} 120 a21 21 0 0 1 42 0 Z`} fill={fill as string} stroke="#C9D8FF" />
          </g>
        ))}
        <circle cx="101" cy="62" r="19" fill={`url(#${id}-deep)`} />
        <path d="M76 120 a25 25 0 0 1 50 0 Z" fill={`url(#${id}-deep)`} />
      </g>
      <g stroke="#B9CCFF" strokeWidth="1.4" strokeDasharray="3 4" fill="none">
        <path className={s.dash} d="M78 68 L92 62" /><path className={s.dash} d="M124 66 L138 70" />
      </g>
      <g className={s.floatFast}>
        <rect x="150" y="38" width="66" height="34" rx="9" fill="#fff" stroke="#C9D8FF" />
        <circle cx="166" cy="55" r="8" fill={`url(#${id}-blue)`} />
        <rect x="180" y="49" width="28" height="3.5" rx="1.75" fill="#C9D8FF" /><rect x="180" y="57" width="18" height="3.5" rx="1.75" fill="#DCE6FF" />
      </g>
      {[[92, 60], [128, 66]].map(([cx, cy], i) => <circle key={i} className={s.pulse} style={{ animationDelay: `${i * .7}s` }} cx={cx} cy={cy} r="3" fill={BLUE} />)}
    </svg>
  );

  // 03 — outcomes: a milestone checklist with a completion mark
  if (name === 'outcomes') return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="112" cy="104" rx="88" ry="32" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <rect x="52" y="26" width="108" height="92" rx="12" fill={`url(#${id}-glass)`} stroke="#C9D8FF" />
        {[0, 1, 2].map(i => (
          <g key={i} className={s.tick} style={{ animationDelay: `${i * .45}s` }}>
            <rect x="66" y={44 + i * 24} width="16" height="16" rx="5" fill={`url(#${id}-blue)`} />
            <path d={`M70 ${52 + i * 24} l3.5 3.5 l5 -6`} stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="90" y={47 + i * 24} width={i === 1 ? 48 : 56} height="4" rx="2" fill="#C9D8FF" />
            <rect x="90" y={55 + i * 24} width="32" height="4" rx="2" fill="#E0E9FF" />
          </g>
        ))}
      </g>
      <g className={s.floatFast}>
        <circle cx="168" cy="92" r="21" fill={`url(#${id}-deep)`} />
        <path d="M159 92 l6 6 l12 -13" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle className={s.pulse} cx="192" cy="46" r="3.5" fill={LAV} />
      <circle className={s.pulse} style={{ animationDelay: '.9s' }} cx="34" cy="76" r="3.5" fill={BLUE} />
    </svg>
  );

  // 04 — talent on tap: a workstation with connected people nodes
  return (
    <svg {...box}><Defs id={id} />
      <ellipse cx="116" cy="110" rx="92" ry="30" fill={`url(#${id}-glow)`} />
      <g className={s.floatSlow}>
        <rect x="62" y="34" width="112" height="72" rx="9" fill={NAVY} />
        <rect x="68" y="40" width="100" height="60" rx="5" fill={`url(#${id}-deep)`} />
        <circle cx="94" cy="62" r="11" fill="#fff" opacity=".92" />
        <path d="M82 84 a12 12 0 0 1 24 0 Z" fill="#fff" opacity=".92" />
        <rect x="116" y="52" width="40" height="4.5" rx="2.25" fill="#fff" opacity=".8" />
        <rect x="116" y="63" width="30" height="4.5" rx="2.25" fill="#fff" opacity=".45" />
        <rect x="116" y="78" width="22" height="9" rx="4.5" fill={BLUE_LIGHT} />
        <path d="M44 114 h148 l-9 10 h-130 Z" fill={`url(#${id}-glass)`} stroke="#C9D8FF" />
      </g>
      <g stroke="#B9CCFF" strokeWidth="1.4" strokeDasharray="3 4" fill="none">
        <path className={s.dash} d="M40 56 L60 62" /><path className={s.dash} d="M196 50 L176 58" /><path className={s.dash} d="M200 92 L178 88" />
      </g>
      {[[28, 44], [198, 36], [206, 84]].map(([x, y], i) => (
        <g key={i} className={s.floatFast} style={{ animationDelay: `${i * .5}s` }}>
          <rect x={x - 3} y={y - 3} width="30" height="30" rx="9" fill="#fff" stroke="#C9D8FF" />
          <circle cx={x + 12} cy={y + 8} r="5" fill={i === 1 ? LAV : BLUE} opacity=".85" />
          <path d={`M${x + 4} ${y + 22} a8 8 0 0 1 16 0 Z`} fill={i === 1 ? LAV : BLUE} opacity=".6" />
        </g>
      ))}
      {[[40, 56], [196, 50], [200, 92]].map(([cx, cy], i) => <circle key={i} className={s.pulse} style={{ animationDelay: `${i * .6}s` }} cx={cx} cy={cy} r="3" fill={BLUE} />)}
    </svg>
  );
}
