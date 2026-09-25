import s from './PracticeGrid.module.css';

/** Isometric illustrations for the five consulting practices.
 *  Inline SVG on purpose: no image requests, scales cleanly, and the small idle motion is CSS, not JavaScript. */

const NAVY = '#0B2A5F', NAVY_MID = '#134087', BLUE = '#0091FF', BLUE_LIGHT = '#5CB8FF', VIOLET = '#0072CC';

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E8F5FF" />
      </linearGradient>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={BLUE_LIGHT} /><stop offset="1" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={NAVY_MID} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={BLUE} stopOpacity=".38" /><stop offset="1" stopColor={BLUE} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** A small floating tile used around the main object in several of the illustrations. */
type Len = number | string;
const Tile = ({ x, y, w = 46, h = 46, id, delay = 0, children }: { x: Len; y: Len; w?: Len; h?: Len; id: string; delay?: number; children?: React.ReactNode }) => (
  <g className={s.float} style={{ animationDelay: `${delay}s` }}>
    <rect x={x} y={y} width={w} height={h} rx="11" fill={`url(#${id}-face)`} stroke="#C9E6FF" />
    {children}
  </g>
);

export function PracticeArt({ name }: { name: string }) {
  const id = `pa-${name}`;
  const common = { viewBox: '0 0 420 260', className: s.art, role: 'presentation' as const, 'aria-hidden': true };

  if (name === 'ai') return (
    <svg {...common}><Defs id={id} />
      <ellipse cx="210" cy="150" rx="150" ry="92" fill={`url(#${id}-glow)`} />
      {/* isometric platform */}
      <path d="M210 196 L118 150 L210 104 L302 150 Z" fill={`url(#${id}-face)`} stroke="#C9E6FF" />
      <path d="M118 150 L210 196 L210 208 L118 162 Z" fill="#DCEFFF" />
      <path d="M302 150 L210 196 L210 208 L302 162 Z" fill="#C9E6FF" />
      {/* chip */}
      <g className={s.rise}>
        <path d="M210 138 L160 112 L210 86 L260 112 Z" fill={`url(#${id}-deep)`} />
        <path d="M160 112 L210 138 L210 152 L160 126 Z" fill={NAVY} />
        <path d="M260 112 L210 138 L210 152 L260 126 Z" fill={NAVY_MID} />
        <text x="210" y="118" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="19" fontWeight="800" fill="#fff">AI</text>
        {[0, 1, 2].map(i => <path key={i} d={`M${176 + i * 12} ${132 + i * 2} l0 16`} stroke={BLUE_LIGHT} strokeWidth="2" opacity=".8" />)}
      </g>
      {/* connectors + nodes */}
      <g stroke="#B9DEFF" strokeWidth="1.5" strokeDasharray="4 5" fill="none">
        <path d="M142 90 L188 106" /><path d="M300 74 L252 100" /><path d="M318 152 L268 134" />
      </g>
      <Tile x="104" y="60" id={id} delay={0}>
        <rect x="116" y="74" width="22" height="3" rx="1.5" fill={BLUE} /><rect x="116" y="82" width="16" height="3" rx="1.5" fill="#9DCEF5" /><rect x="116" y="90" width="20" height="3" rx="1.5" fill="#9DCEF5" />
      </Tile>
      <Tile x="290" y="44" id={id} delay={.9}>
        <circle cx="313" cy="67" r="9" fill="none" stroke={VIOLET} strokeWidth="2.5" /><path d="M313 62 v10 M308 67 h10" stroke={VIOLET} strokeWidth="2.5" strokeLinecap="round" />
      </Tile>
      <Tile x="306" y="128" id={id} delay={.45}>
        <path d="M318 151 l7 7 l13 -14" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Tile>
      {[[150, 84], [296, 70], [312, 148]].map(([cx, cy], i) => <circle key={i} className={s.pulse} style={{ animationDelay: `${i * 0.6}s` }} cx={cx} cy={cy} r="3.5" fill={BLUE} />)}
    </svg>
  );

  if (name === 'cloud') return (
    <svg {...common}><Defs id={id} />
      <ellipse cx="210" cy="160" rx="150" ry="86" fill={`url(#${id}-glow)`} />
      <g className={s.drift}>
        <path d="M160 96 a30 30 0 0 1 58 -10 a24 24 0 0 1 36 12 a22 22 0 0 1 -4 44 h-84 a24 24 0 0 1 -6 -46 Z" fill={`url(#${id}-blue)`} opacity=".9" />
        <path d="M176 92 a20 20 0 0 1 38 -7" stroke="#fff" strokeWidth="2.5" fill="none" opacity=".6" strokeLinecap="round" />
      </g>
      {/* server stack */}
      {[0, 1].map(i => (
        <g key={i} transform={`translate(0 ${i * -22})`}>
          <path d="M210 208 L142 172 L210 136 L278 172 Z" fill={`url(#${id}-face)`} stroke="#C9E6FF" />
          <path d="M142 172 L210 208 L210 220 L142 184 Z" fill="#D5ECFF" />
          <path d="M278 172 L210 208 L210 220 L278 184 Z" fill="#BFE2FF" />
          <circle cx="196" cy="180" r="3" fill={BLUE} /><circle cx="208" cy="186" r="3" fill={BLUE_LIGHT} />
        </g>
      ))}
      <g stroke="#B9DEFF" strokeWidth="1.5" strokeDasharray="4 5" fill="none">
        <path d="M120 128 L168 128" /><path d="M300 122 L262 128" /><path d="M318 180 L282 168" />
      </g>
      <Tile x="72" y="106" id={id} delay={.3}><path d="M84 132 h22 M84 138 h14" stroke={BLUE} strokeWidth="3" strokeLinecap="round" /><circle cx="95" cy="120" r="6" fill="none" stroke="#9DCEF5" strokeWidth="2.5" /></Tile>
      <Tile x="300" y="98" id={id} delay={1.1}><rect x="312" y="112" width="22" height="16" rx="3" fill="none" stroke={VIOLET} strokeWidth="2.5" /><path d="M312 118 h22" stroke={VIOLET} strokeWidth="2.5" /></Tile>
      <Tile x="312" y="158" id={id} delay={.7}><circle cx="335" cy="181" r="10" fill="none" stroke={BLUE} strokeWidth="2.5" /><path d="M330 181 l4 4 l7 -8" stroke={BLUE} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Tile>
      {[[120, 128], [298, 122], [316, 180]].map(([cx, cy], i) => <circle key={i} className={s.pulse} style={{ animationDelay: `${i * 0.5}s` }} cx={cx} cy={cy} r="3.5" fill={BLUE} />)}
    </svg>
  );

  if (name === 'security') return (
    <svg {...common}><Defs id={id} />
      <ellipse cx="210" cy="140" rx="140" ry="92" fill={`url(#${id}-glow)`} />
      <g className={s.rise}>
        <path d="M210 44 L288 74 v64 c0 44 -34 72 -78 86 c-44 -14 -78 -42 -78 -86 V74 Z" fill={`url(#${id}-deep)`} />
        <path d="M210 44 L288 74 v64 c0 44 -34 72 -78 86 Z" fill={NAVY} opacity=".35" />
        <g className={s.sweep}><path d="M210 44 L288 74 v64 c0 44 -34 72 -78 86 c-44 -14 -78 -42 -78 -86 V74 Z" fill="#fff" opacity=".18" /></g>
        <rect x="186" y="112" width="48" height="40" rx="8" fill="#fff" opacity=".95" />
        <path d="M196 112 v-10 a14 14 0 0 1 28 0 v10" stroke="#fff" strokeWidth="6" fill="none" />
        <circle cx="210" cy="130" r="5" fill={NAVY_MID} /><rect x="208" y="132" width="4" height="10" rx="2" fill={NAVY_MID} />
      </g>
      <g stroke="#B9DEFF" strokeWidth="1.5" strokeDasharray="4 5" fill="none">
        <path d="M118 108 L150 116" /><path d="M302 96 L272 108" /><path d="M306 172 L276 160" />
      </g>
      <Tile x="72" y="84" id={id} delay={.2}><path d="M95 98 c-8 0 -12 6 -12 12 c0 8 12 14 12 14 s12 -6 12 -14 c0 -6 -4 -12 -12 -12Z" fill="none" stroke={BLUE} strokeWidth="2.5" /></Tile>
      <Tile x="300" y="74" id={id} delay={.95}><rect x="312" y="88" width="22" height="18" rx="3" fill="none" stroke={VIOLET} strokeWidth="2.5" /><path d="M317 96 h12 M317 101 h8" stroke={VIOLET} strokeWidth="2" strokeLinecap="round" /></Tile>
      <Tile x="304" y="150" id={id} delay={.55}><circle cx="322" cy="170" r="6" fill="none" stroke={BLUE} strokeWidth="2.5" /><path d="M334 178 a10 10 0 0 0 -20 0" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" /></Tile>
      {[[118, 108], [300, 96], [304, 172]].map(([cx, cy], i) => <circle key={i} className={s.pulse} style={{ animationDelay: `${i * 0.55}s` }} cx={cx} cy={cy} r="3.5" fill={BLUE} />)}
    </svg>
  );

  if (name === 'software') return (
    <svg {...common}><Defs id={id} />
      <ellipse cx="210" cy="160" rx="150" ry="86" fill={`url(#${id}-glow)`} />
      {/* laptop */}
      <g className={s.rise}>
        <path d="M126 76 h150 a8 8 0 0 1 8 8 v86 h-166 V84 a8 8 0 0 1 8 -8Z" fill={NAVY} />
        <rect x="134" y="84" width="142" height="78" rx="4" fill={`url(#${id}-deep)`} />
        <rect x="144" y="96" width="52" height="5" rx="2.5" fill="#fff" opacity=".85" />
        <rect x="144" y="108" width="80" height="4" rx="2" fill="#fff" opacity=".45" />
        <rect x="144" y="118" width="64" height="4" rx="2" fill="#fff" opacity=".45" />
        <rect x="144" y="132" width="40" height="18" rx="5" fill={BLUE_LIGHT} opacity=".9" />
        <path d="M104 170 h212 l-10 14 h-192 Z" fill="#DCEFFF" stroke="#C9E6FF" />
      </g>
      {/* phone */}
      <g className={s.float} style={{ animationDelay: '.4s' }}>
        <rect x="252" y="112" width="58" height="96" rx="12" fill="#fff" stroke="#C9E6FF" />
        <rect x="260" y="124" width="42" height="26" rx="6" fill={`url(#${id}-blue)`} />
        <rect x="260" y="158" width="42" height="5" rx="2.5" fill="#D5ECFF" />
        <rect x="260" y="170" width="30" height="5" rx="2.5" fill="#D5ECFF" />
        <rect x="260" y="184" width="42" height="12" rx="6" fill="#E8F4FF" stroke="#C9E6FF" />
      </g>
      <Tile x="78" y="72" id={id} delay={.9}><path d="M90 96 l-6 6 l6 6 M106 96 l6 6 l-6 6" stroke={BLUE} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Tile>
      <Tile x="322" y="70" id={id} delay={.2}><rect x="334" y="84" width="20" height="18" rx="3" fill="none" stroke={VIOLET} strokeWidth="2.5" /><path d="M339 90 h10 M339 96 h6" stroke={VIOLET} strokeWidth="2" strokeLinecap="round" /></Tile>
      <Tile x="326" y="140" id={id} delay={.6}><path d="M338 164 h18 M338 172 h10" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" /><circle cx="349" cy="156" r="5" fill="none" stroke="#9DCEF5" strokeWidth="2" /></Tile>
      {[[112, 92], [318, 88], [320, 160]].map(([cx, cy], i) => <circle key={i} className={s.pulse} style={{ animationDelay: `${i * 0.5}s` }} cx={cx} cy={cy} r="3.5" fill={BLUE} />)}
    </svg>
  );

  if (name === 'qa') return (
    <svg {...common}><Defs id={id} />
      <ellipse cx="210" cy="152" rx="150" ry="90" fill={`url(#${id}-glow)`} />
      {/* the run: a browser under test, with each spec turning green in turn */}
      <g className={s.rise}>
        <rect x="96" y="66" width="196" height="132" rx="12" fill="#fff" stroke="#C9E6FF" />
        <path d="M96 84 h196" stroke="#C9E6FF" strokeWidth="1.5" />
        {[0, 1, 2].map(i => <circle key={i} cx={112 + i * 12} cy="75" r="3.5" fill={i ? '#D5ECFF' : BLUE_LIGHT} />)}
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect x="130" y={102 + i * 22} width={i === 3 ? 86 : 118} height="6" rx="3" fill="#D5ECFF" />
            <circle className={s.pulse} style={{ animationDelay: `${i * 0.28}s` }} cx="115" cy={105 + i * 22} r="8" fill="#E6F6EF" />
            <path className={s.grow} style={{ animationDelay: `${i * 0.28}s`, transformOrigin: `115px ${105 + i * 22}px` }}
              d={`M111 ${105 + i * 22} l3 3.5 l6 -7`} stroke="#0E9F6E" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </g>
      {/* the runner that drives it */}
      <g className={s.float} style={{ animationDelay: '.35s' }}>
        <path d="M300 148 L252 122 L300 96 L348 122 Z" fill={`url(#${id}-deep)`} />
        <path d="M252 122 L300 148 L300 162 L252 136 Z" fill={NAVY} />
        <path d="M348 122 L300 148 L300 162 L348 136 Z" fill={NAVY_MID} />
        <text x="300" y="128" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">QA</text>
      </g>
      <g stroke="#B9DEFF" strokeWidth="1.5" strokeDasharray="4 5" fill="none"><path d="M292 124 L262 118" /></g>
      <Tile x="304" y="52" id={id} delay={.1}><path d="M314 74 l5 5 l9 -11" stroke="#0E9F6E" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Tile>
      <Tile x="62" y="140" id={id} delay={.7}><path d="M74 164 h22 M74 172 h14" stroke={VIOLET} strokeWidth="2.5" strokeLinecap="round" /><circle cx="85" cy="154" r="5" fill="none" stroke="#9DCEF5" strokeWidth="2" /></Tile>
      <circle className={s.pulse} style={{ animationDelay: '.5s' }} cx="328" cy="76" r="3.5" fill={BLUE} />
    </svg>
  );

  // data
  return (
    <svg {...common}><Defs id={id} />
      <ellipse cx="210" cy="158" rx="150" ry="88" fill={`url(#${id}-glow)`} />
      {/* database cylinders */}
      <g className={s.float}>
        {[0, 1, 2].map(i => (
          <g key={i} transform={`translate(0 ${i * 26})`}>
            <ellipse cx="120" cy="120" rx="40" ry="14" fill={`url(#${id}-face)`} stroke="#C9E6FF" />
            <path d="M80 120 v18 a40 14 0 0 0 80 0 v-18" fill="#E8F5FF" stroke="#C9E6FF" />
          </g>
        ))}
      </g>
      {/* dashboard panel */}
      <g className={s.rise}>
        <rect x="186" y="74" width="168" height="116" rx="12" fill="#fff" stroke="#C9E6FF" />
        <rect x="200" y="88" width="56" height="5" rx="2.5" fill="#9DCEF5" />
        {[[210, 60], [232, 84], [254, 44], [276, 96], [298, 70]].map(([x, h], i) => (
          <rect key={i} className={s.grow} style={{ animationDelay: `${i * 0.12}s`, transformOrigin: `${x + 7}px 170px` }}
            x={x} y={170 - h} width="14" height={h} rx="4" fill={i % 2 ? `url(#${id}-blue)` : `url(#${id}-deep)`} />
        ))}
        <path d="M204 150 L232 132 L258 140 L286 112 L316 122" stroke={VIOLET} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
        <circle className={s.pulse} cx="286" cy="112" r="4" fill={VIOLET} />
      </g>
      <g stroke="#B9DEFF" strokeWidth="1.5" strokeDasharray="4 5" fill="none"><path d="M162 132 L186 126" /></g>
      <circle className={s.pulse} style={{ animationDelay: '.7s' }} cx="166" cy="131" r="3.5" fill={BLUE} />
    </svg>
  );
}
