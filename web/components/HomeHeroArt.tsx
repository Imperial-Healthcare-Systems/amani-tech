import s from './HomeHeroArt.module.css';

const NAVY = '#0B2A5F', NAVY_MID = '#134087', BLUE = '#0091FF', BLUE_LIGHT = '#5CB8FF';
const CX = 262, CY = 252, R = 142;
const ROUTE = 'M186 182 C 252 132, 330 178, 336 292';

// Latitudes: half-width of the circle at each height, so the wireframe sits on the sphere.
const LATS = [-104, -56, 0, 56, 104].map(dy => ({ dy, rx: Math.round(Math.sqrt(R * R - dy * dy)), ry: 16 + Math.round((R - Math.abs(dy)) / 9) }));

/** Two offices, four practices, clients worldwide — the home hero states the company, not a job search.
 *  Replaced by a photo the moment one is set in Admin → Website CMS → Hero. */
export function HomeHeroArt() {
  return (
    <svg className={s.art} viewBox="0 0 524 500" role="img" aria-label="Amani Tech works from Hyderabad and Toronto, delivering technology, talent, GCC and transformation services worldwide">
      <defs>
        <radialGradient id="hh-glow" cx="50%" cy="42%">
          <stop offset="0%" stopColor="#DCF1FF" stopOpacity=".95" />
          <stop offset="100%" stopColor="#DCF1FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hh-globe" x1="18%" y1="6%" x2="86%" y2="96%">
          <stop offset="0%" stopColor="#F4FBFF" />
          <stop offset="58%" stopColor="#E4F4FF" />
          <stop offset="100%" stopColor="#CFEAFF" />
        </linearGradient>
        <linearGradient id="hh-deep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={NAVY_MID} />
          <stop offset="100%" stopColor={NAVY} />
        </linearGradient>
        <linearGradient id="hh-tile" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3FAFF" />
        </linearGradient>
        <clipPath id="hh-sphere"><circle cx={CX} cy={CY} r={R} /></clipPath>
      </defs>

      <ellipse cx={CX} cy={CY - 6} rx="250" ry="216" fill="url(#hh-glow)" />

      {/* the globe */}
      <circle cx={CX} cy={CY} r={R} fill="url(#hh-globe)" stroke="#C3E4FF" />
      <g clipPath="url(#hh-sphere)" stroke="#B4DBFA" strokeWidth="1" fill="none" opacity=".85">
        {LATS.map(l => <ellipse key={l.dy} cx={CX} cy={CY + l.dy} rx={l.rx} ry={l.ry} />)}
        <g className={s.spin}>
          {[R, R * 0.66, R * 0.3].map((rx, i) => <ellipse key={i} cx={CX} cy={CY} rx={rx} ry={R} />)}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} />
        </g>
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#A9D5F7" strokeWidth="1.5" />

      {/* the corridor we actually run: Toronto to Hyderabad */}
      <path d={ROUTE} fill="none" stroke={BLUE_LIGHT} strokeWidth="2" opacity=".55" />
      <path className={s.trail} d={ROUTE} fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
      <circle className={s.spark} r="4.5" fill={BLUE} style={{ offsetPath: `path('${ROUTE}')` }} />

      {[['Toronto', 186, 182], ['Hyderabad', 336, 292]].map(([label, x, y]) => (
        <g key={label as string}>
          <circle className={s.node} cx={x as number} cy={y as number} r="9" fill={BLUE_LIGHT} />
          <circle cx={x as number} cy={y as number} r="7" fill="#fff" stroke={BLUE} strokeWidth="3" />
          <rect x={(x as number) - 44} y={(y as number) + 14} width="88" height="24" rx="12" fill={NAVY} opacity=".92" />
          <text x={x as number} y={(y as number) + 30} textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff" letterSpacing=".02em">{label}</text>
        </g>
      ))}

      {/* the four practices, orbiting the places they are delivered from */}
      {([
        ['Technology', 18, 52, 0, 'M9 1 1 11h7l-1 7 8-10H8l1-7Z'],
        ['Talent', 342, 22, 1.4, 'M6.5 8a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7 0a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4ZM1 16.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5M13 11.6c2.4.2 4 2 4 4.4'],
        ['GCC Practice', 6, 386, .7, 'M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1Zm0 0c2.4 2.2 3.6 5 3.6 8s-1.2 5.8-3.6 8c-2.4-2.2-3.6-5-3.6-8S6.6 3.2 9 1ZM1.4 6.6h15.2M1.4 11.4h15.2'],
        ['Transformation', 350, 404, 2.1, 'M1 13.5 6 8l4 3.5L17 4M17 4h-5M17 4v5'],
      ] as const).map(([label, x, y, delay, d]) => (
        <g key={label} className={s.float} style={{ animationDelay: `${delay}s` }}>
          <rect x={x} y={y} width="158" height="52" rx="14" fill="url(#hh-tile)" stroke="#C9E6FF" />
          <rect x={x + 12} y={y + 12} width="28" height="28" rx="9" fill="#EAF6FF" />
          <g transform={`translate(${x + 21} ${y + 21})`} stroke={BLUE} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></g>
          <text x={x + 50} y={y + 31} fontSize="13" fontWeight="600" fill={NAVY}>{label}</text>
        </g>
      ))}

    </svg>
  );
}
