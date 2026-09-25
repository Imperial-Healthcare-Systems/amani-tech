/** Four isometric scenes for the GCC "Why Amani Tech" cards. Every face is projected from world
 *  coordinates, so depth and proportion stay consistent across the set. Static by design — the
 *  section's only motion is the entrance and the hover. */

type Pt = [number, number];
type Iso = ((x: number, y: number, z?: number) => Pt) & { k: number };

const CO = 0.866, SI = 0.5;
function makeIso(ox: number, oy: number, k: number): Iso {
  return Object.assign((x: number, y: number, z = 0): Pt => [ox + (x - y) * CO * k, oy + (x + y) * SI * k - z * k], { k });
}
const r1 = (n: number) => Math.round(n * 10) / 10;
const poly = (...ps: Pt[]) => 'M' + ps.map(q => `${r1(q[0])} ${r1(q[1])}`).join('L') + 'Z';
const seg = (a: Pt, b: Pt) => `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`;
const open = (...ps: Pt[]) => 'M' + ps.map(q => `${r1(q[0])} ${r1(q[1])}`).join('L');

const NAVY = '#0B2A5F', NAVY_MID = '#134087', BLUE = '#0091FF', BLUE_LIGHT = '#5CB8FF', SKY = '#93E0FD', STEEL = '#C9E6FF', EDGE = '#B6D7F2';

function Defs({ id }: { id: string }) {
  const v = (name: string, a: string, b: string) => (
    <linearGradient id={`${id}-${name}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
  );
  return (
    <defs>
      {v('gl', '#EAF7FF', '#B3DCFA')}
      {v('gr', '#8DCAF4', '#479BDC')}
      {v('wl', '#FFFFFF', '#E2F1FC')}
      {v('wr', '#D8ECFB', '#B8D7F0')}
      {v('sl', '#D3EAFB', '#9FCFF2')}
      {v('sr', '#A8D3F4', '#6AB0E4')}
      {v('st', '#F9FDFF', '#EDF6FE')}
      {v('deep', BLUE, NAVY_MID)}
      {v('blue', BLUE_LIGHT, BLUE)}
      {v('arch', '#C5E2F8', '#93C1E7')}
      <linearGradient id={`${id}-col`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#CFE7FA" /></linearGradient>
      <linearGradient id={`${id}-pin`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={BLUE_LIGHT} /><stop offset=".55" stopColor={BLUE} /><stop offset="1" stopColor={NAVY_MID} /></linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={BLUE} stopOpacity=".24" /><stop offset="1" stopColor={BLUE} stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-tree`} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#BCDBF3" /></radialGradient>
      <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" /></filter>
    </defs>
  );
}

/** A box: corner (x, y, z), extents w along x, d along y, h up. */
function Box({ p, x, y, z = 0, w, d, h, top, left, right, edge = EDGE }: { p: Iso; x: number; y: number; z?: number; w: number; d: number; h: number; top: string; left: string; right: string; edge?: string }) {
  return (
    <g strokeWidth=".55" strokeLinejoin="round" stroke={edge}>
      <path d={poly(p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h))} fill={left} />
      <path d={poly(p(x + w, y + d, z), p(x + w, y, z), p(x + w, y, z + h), p(x + w, y + d, z + h))} fill={right} />
      <path d={poly(p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h))} fill={top} />
    </g>
  );
}

/** A curtain-wall tower: a box with floor lines and mullions on both visible faces. */
function Tower({ p, id, x, y, w, d, h, floors, cols = 3, glass = true }: { p: Iso; id: string; x: number; y: number; w: number; d: number; h: number; floors: number; cols?: number; glass?: boolean }) {
  const a: string[] = [], b: string[] = [];
  for (let i = 1; i < floors; i++) {
    const z = (h * i) / floors;
    a.push(seg(p(x, y + d, z), p(x + w, y + d, z)));
    b.push(seg(p(x + w, y + d, z), p(x + w, y, z)));
  }
  for (let j = 1; j < cols; j++) {
    a.push(seg(p(x + (w * j) / cols, y + d, 0), p(x + (w * j) / cols, y + d, h)));
    b.push(seg(p(x + w, y + (d * j) / cols, 0), p(x + w, y + (d * j) / cols, h)));
  }
  return (
    <g>
      <Box p={p} x={x} y={y} w={w} d={d} h={h} top={glass ? '#F3FBFF' : '#FFFFFF'} left={`url(#${id}-${glass ? 'gl' : 'wl'})`} right={`url(#${id}-${glass ? 'gr' : 'wr'})`} />
      <path d={a.join('')} stroke="#FFFFFF" strokeOpacity={glass ? .7 : .9} strokeWidth=".55" />
      <path d={b.join('')} stroke="#FFFFFF" strokeOpacity={glass ? .35 : .6} strokeWidth=".55" />
    </g>
  );
}

/** A vertical cylinder standing at (x, y) from z0 to z1. */
function Cyl({ p, x, y, z0, z1, r, fill, top }: { p: Iso; x: number; y: number; z0: number; z1: number; r: number; fill: string; top: string }) {
  const [bx, by] = p(x, y, z0), [tx, ty] = p(x, y, z1);
  const rx = r * 1.414 * CO * p.k, ry = r * 1.414 * SI * p.k;
  const body = `M${r1(bx - rx)} ${r1(by)}L${r1(tx - rx)} ${r1(ty)}L${r1(tx + rx)} ${r1(ty)}L${r1(bx + rx)} ${r1(by)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(bx - rx)} ${r1(by)}Z`;
  return (
    <g stroke={EDGE} strokeWidth=".5">
      <path d={body} fill={fill} />
      <ellipse cx={r1(tx)} cy={r1(ty)} rx={r1(rx)} ry={r1(ry)} fill={top} />
    </g>
  );
}

/** One arch cut into a face: on the face y = const (axis 'x') or x = const (axis 'y'). */
function arch(p: Iso, axis: 'x' | 'y', along: number, face: number, half: number, spring: number, z0 = 0) {
  const at = (u: number, z: number) => (axis === 'x' ? p(u, face, z0 + z) : p(face, u, z0 + z));
  const pts: Pt[] = [at(along - half, 0), at(along - half, spring)];
  for (let i = 1; i < 14; i++) { const t = Math.PI - (Math.PI * i) / 14; pts.push(at(along + half * Math.cos(t), spring + half * Math.sin(t))); }
  pts.push(at(along + half, spring), at(along + half, 0));
  return poly(...pts);
}

function Tree({ p, id, x, y, s = 1 }: { p: Iso; id: string; x: number; y: number; s?: number }) {
  const [bx, by] = p(x, y, 0);
  const r = 3.2 * s * p.k;
  return (
    <g>
      <ellipse cx={r1(bx)} cy={r1(by)} rx={r1(r * 1.1)} ry={r1(r * .45)} fill={NAVY} opacity=".08" />
      <path d={`M${r1(bx)} ${r1(by)}V${r1(by - r * 1.3)}`} stroke={EDGE} strokeWidth=".9" />
      <circle cx={r1(bx)} cy={r1(by - r * 1.6)} r={r1(r)} fill={`url(#${id}-tree)`} stroke={EDGE} strokeWidth=".45" />
    </g>
  );
}

/* ================================================================
   01 — Hyderabad specialists: the city at a crossroads, Charminar at its heart
   ================================================================ */
function Hyderabad() {
  const id = 'wg-hyd';
  const p = makeIso(120, 50, 1);
  const top: Pt[] = [p(0, 0), p(100, 0), p(100, 100), p(0, 100)];
  const minaret = (x: number, y: number) => {
    const [tx, ty] = p(x, y, 42);
    const rx = 2.3 * 1.414 * CO * p.k;
    return (
      <g key={`${x}-${y}`}>
        <Cyl p={p} x={x} y={y} z0={0} z1={42} r={2.3} fill={`url(#${id}-col)`} top="#FFFFFF" />
        {[24, 34].map(z => <Cyl key={z} p={p} x={x} y={y} z0={z} z1={z + 1.2} r={3.1} fill="#E8F4FD" top="#FFFFFF" />)}
        <path d={`M${r1(tx - rx)} ${r1(ty)}C${r1(tx - rx * 1.25)} ${r1(ty - rx * 1.5)} ${r1(tx)} ${r1(ty - rx * 1.9)} ${r1(tx)} ${r1(ty - rx * 2.7)}C${r1(tx)} ${r1(ty - rx * 1.9)} ${r1(tx + rx * 1.25)} ${r1(ty - rx * 1.5)} ${r1(tx + rx)} ${r1(ty)}Z`} fill="#FFFFFF" stroke={EDGE} strokeWidth=".5" />
      </g>
    );
  };
  const [pinX, pinY] = p(50, 50, 71);
  return (
    <svg viewBox="0 0 240 160" role="presentation" aria-hidden="true">
      <Defs id={id} />
      <ellipse cx="120" cy="108" rx="112" ry="38" fill={`url(#${id}-glow)`} />

      {/* the platform, with a lit leading edge */}
      <path d={poly(p(0, 100, -5), p(100, 100, -5), p(100, 100, 0), p(0, 100, 0))} fill={`url(#${id}-sl)`} />
      <path d={poly(p(100, 100, -5), p(100, 0, -5), p(100, 0, 0), p(100, 100, 0))} fill={`url(#${id}-sr)`} />
      <path d={poly(...top)} fill={`url(#${id}-st)`} stroke={EDGE} strokeWidth=".6" />
      <path d={open(p(0, 100), p(100, 100), p(100, 0))} fill="none" stroke={BLUE_LIGHT} strokeWidth="3.4" opacity=".5" filter={`url(#${id}-blur)`} />
      <path d={open(p(0, 100), p(100, 100), p(100, 0))} fill="none" stroke="#8DD5FF" strokeWidth="1" />

      {/* two roads crossing at the centre — Charminar stands at the crossroads */}
      <path d={poly(p(0, 45), p(100, 45), p(100, 55), p(0, 55))} fill="#E1F0FB" />
      <path d={poly(p(45, 0), p(55, 0), p(55, 100), p(45, 100))} fill="#E1F0FB" />
      <path d={seg(p(0, 50), p(100, 50)) + seg(p(50, 0), p(50, 100))} stroke="#FFFFFF" strokeWidth=".8" strokeDasharray="2.6 2.6" />

      {/* back of the district */}
      <Tower p={p} id={id} x={12} y={8} w={16} d={16} h={56} floors={10} />
      <Tower p={p} id={id} x={8} y={29} w={12} d={11} h={32} floors={6} glass={false} />
      <Tree p={p} id={id} x={35} y={34} />
      <Tower p={p} id={id} x={66} y={10} w={15} d={14} h={44} floors={8} />
      <Tower p={p} id={id} x={9} y={66} w={15} d={14} h={34} floors={6} />
      <Tree p={p} id={id} x={36} y={63} />
      <Tree p={p} id={id} x={63} y={35} />

      {/* Charminar: back minaret, the arched hall, then the three minarets in front of it */}
      {minaret(40, 40)}
      <Box p={p} x={40} y={40} w={20} d={20} h={20} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />
      <path d={arch(p, 'x', 50, 60, 6, 11)} fill={`url(#${id}-arch)`} />
      <path d={arch(p, 'y', 50, 60, 6, 11)} fill="#8AB9E0" />
      <Box p={p} x={42.5} y={42.5} w={15} d={15} h={5} z={20} top="#FFFFFF" left="#F4FAFF" right="#D5E9FA" />
      {[45.5, 50, 54.5].map(u => <path key={`gx${u}`} d={arch(p, 'x', u, 57.5, 1.3, 1.2, 20.6)} fill="#B4D5F0" />)}
      {[45.5, 50, 54.5].map(u => <path key={`gy${u}`} d={arch(p, 'y', u, 57.5, 1.3, 1.2, 20.6)} fill="#93BEE2" />)}
      {minaret(40, 60)}
      {minaret(60, 40)}
      {minaret(60, 60)}

      {/* front of the district */}
      <Tower p={p} id={id} x={84} y={24} w={10} d={12} h={22} floors={4} glass={false} />
      <Tree p={p} id={id} x={64} y={64} />
      <Box p={p} x={68} y={68} w={22} d={18} h={9} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />
      <path d={seg(p(68, 86, 4.5), p(90, 86, 4.5)) + seg(p(90, 86, 4.5), p(90, 68, 4.5))} stroke={SKY} strokeWidth="1.2" />
      <Tree p={p} id={id} x={90} y={92} s={.9} />
      <Tree p={p} id={id} x={14} y={90} s={.9} />

      {/* the pin, over the old city */}
      <ellipse cx={r1(pinX)} cy={r1(p(50, 50, 25)[1])} rx="6" ry="2.2" fill={BLUE} opacity=".18" />
      <path d={`M${r1(pinX)} ${r1(pinY + 17)}C${r1(pinX - 2.5)} ${r1(pinY + 11)} ${r1(pinX - 8)} ${r1(pinY + 7)} ${r1(pinX - 8)} ${r1(pinY)}A8 8 0 1 1 ${r1(pinX + 8)} ${r1(pinY)}C${r1(pinX + 8)} ${r1(pinY + 7)} ${r1(pinX + 2.5)} ${r1(pinY + 11)} ${r1(pinX)} ${r1(pinY + 17)}Z`} fill={`url(#${id}-pin)`} />
      <circle cx={r1(pinX)} cy={r1(pinY)} r="3.2" fill="#FFFFFF" />
      <path d={`M${r1(pinX - 4.5)} ${r1(pinY - 4.4)}a6.5 6.5 0 0 1 5.4 -2.4`} stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".55" />

      {/* market signal: salary benchmarks */}
      <g>
        <rect x="186" y="6" width="50" height="32" rx="7" fill="#FFFFFF" stroke={STEEL} />
        <rect x="192.5" y="12.5" width="19" height="3" rx="1.5" fill={NAVY_MID} opacity=".45" />
        {[[193, 8], [200, 12], [207, 16]].map(([x, h]) => <rect key={x} x={x} y={32 - h} width="5" height={h} rx="1.4" fill={`url(#${id}-blue)`} />)}
        <path d="M215 29 L220 23 L224 25 L229 18" stroke={BLUE} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ================================================================
   02 — One partner, not six: six functions converge on one operating layer
   ================================================================ */
function glyph(name: string) {
  const common = { fill: 'none', stroke: BLUE, strokeWidth: 1.25, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'legal': return <g {...common}><path d="M6 1.6v9M3.2 10.6h5.6M1.6 3.4h8.8M1.6 3.4 .4 6.6h2.4zM10.4 3.4 9.2 6.6h2.4z" /></g>;
    case 'compliance': return <g {...common}><path d="M2.6 1h4.8L9.8 3.4V11H2.6zM7.4 1v2.4h2.4" /><path d="M4.3 7.1l1.3 1.3 2.3-2.5" /></g>;
    case 'estate': return <g {...common}><path d="M2.2 11V2.4h7.6V11M.8 11h10.4M4.3 4.6h.9M6.8 4.6h.9M4.3 6.9h.9M6.8 6.9h.9M5.2 11V9h1.6v2" /></g>;
    case 'recruit': return <g {...common}><circle cx="4.2" cy="3.8" r="1.8" /><circle cx="8.6" cy="4.5" r="1.5" /><path d="M1 10.6a3.2 3.2 0 0 1 6.4 0M7.2 10.6a2.5 2.5 0 0 1 4.3-1.4" /></g>;
    case 'finance': return <g {...common} strokeWidth={1.5}><path d="M1.6 10.8h8.8M3.2 9V6.8M6 9V4.4M8.8 9V2.2" /></g>;
    default: return <g {...common}><circle cx="2.6" cy="3" r="1.5" /><circle cx="9.4" cy="3" r="1.5" /><circle cx="6" cy="9.4" r="1.5" /><path d="M4.1 3h3.8M3.4 4.3l1.8 3.7M8.6 4.3 6.8 8" /></g>;
  }
}

function OnePartner() {
  const id = 'wg-one';
  const p = makeIso(120, 106, 1);
  const L: [string, string][] = [['Legal', 'legal'], ['Compliance', 'compliance'], ['Real Estate', 'estate']];
  const R: [string, string][] = [['Recruitment', 'recruit'], ['Finance', 'finance'], ['Vendors', 'vendors']];
  const rows = [30, 60, 90];
  const [lx, ly] = p(0, 30, 15);
  const [rx, ry] = p(30, 0, 15);
  const tile = (x: number, y: number, label: string, icon: string) => (
    <g key={label}>
      <rect x={x} y={y} width="82" height="21" rx="6" fill="#FFFFFF" stroke={STEEL} />
      <g transform={`translate(${x + 6} ${y + 4.5})`}>{glyph(icon)}</g>
      <text x={x + 21} y={y + 14.1} fontSize="8.9" fontWeight="600" fill={NAVY}>{label}</text>
    </g>
  );
  const layers: { z: number; top: string; left: string; right: string }[] = [
    { z: 0, top: '#F6FBFF', left: `url(#${id}-wl)`, right: `url(#${id}-wr)` },
    { z: 11, top: '#E3F4FF', left: `url(#${id}-gl)`, right: '#9DCFF2' },
    { z: 22, top: '#8FD3FF', left: `url(#${id}-blue)`, right: `url(#${id}-deep)` },
  ];
  return (
    <svg viewBox="0 0 240 160" role="presentation" aria-hidden="true">
      <Defs id={id} />
      <ellipse cx="120" cy="122" rx="62" ry="22" fill={`url(#${id}-glow)`} />

      {/* the connectors converge on the platform's two outer corners */}
      <g fill="none" stroke={SKY} strokeWidth="1.1">
        {rows.map(y => <path key={`l${y}`} d={`M85 ${y + 10.5}C92 ${y + 10.5} ${r1(lx - 5)} ${r1(ly)} ${r1(lx)} ${r1(ly)}`} />)}
        {rows.map(y => <path key={`r${y}`} d={`M155 ${y + 10.5}C148 ${y + 10.5} ${r1(rx + 5)} ${r1(ry)} ${r1(rx)} ${r1(ry)}`} />)}
      </g>

      {/* one operating layer, built up in three plates */}
      {layers.map(l => <Box key={l.z} p={p} x={0} y={0} z={l.z} w={30} d={30} h={6} top={l.top} left={l.left} right={l.right} />)}
      <path d={poly(p(8, 8, 28.2), p(22, 8, 28.2), p(22, 22, 28.2), p(8, 22, 28.2))} fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth=".8" />
      <circle cx={r1(lx)} cy={r1(ly)} r="2.4" fill={BLUE} />
      <circle cx={r1(rx)} cy={r1(ry)} r="2.4" fill={BLUE} />

      {/* the partner: Amani Tech, above the stack */}
      <path d={`M120 52V${r1(p(15, 15, 28)[1] - 3)}`} stroke={BLUE_LIGHT} strokeWidth="1.2" strokeDasharray="2.5 2.5" />
      <circle cx="120" cy="36" r="22" fill={`url(#${id}-glow)`} />
      <rect x="105" y="21" width="30" height="30" rx="9" fill={`url(#${id}-deep)`} />
      <rect x="105.5" y="21.5" width="29" height="29" rx="8.5" fill="none" stroke="#FFFFFF" strokeOpacity=".25" />
      <g transform="translate(109 25) scale(.55)" fill="#FFFFFF">
        <path d="M4 34C8 20 20 10 37 6c-7 6-10 12-11 20-4-4-12 0-22 8z" />
        <path d="M10 38c4-8 12-14 23-16-5 4-7 8-8 13-3-2-9 0-15 3z" opacity=".6" />
      </g>

      {L.map(([t, i], k) => tile(3, rows[k], t, i))}
      {R.map(([t, i], k) => tile(155, rows[k], t, i))}
      {rows.map(y => <circle key={`dl${y}`} cx="85" cy={y + 10.5} r="1.9" fill={BLUE} />)}
      {rows.map(y => <circle key={`dr${y}`} cx="155" cy={y + 10.5} r="1.9" fill={BLUE} />)}
    </svg>
  );
}

/* ================================================================
   03 — Any headquarters, one destination: every region routes to Hyderabad
   ================================================================ */
function AnyHQ() {
  const id = 'wg-hq';
  const cx = 120, cy = 62, R = 42;
  const hyd: Pt = [146.5, 67];
  const continents = [
    'M80 28C88 24 95 30 93 38C91 44 86 46 88 52C92 60 94 72 88 84C84 80 82 70 80 60C78 50 76 38 80 28Z',
    'M112 28C118 23 131 25 133 31C134 36 128 40 121 39C115 38 108 34 112 28Z',
    'M110 44C118 40 129 42 133 50C135 59 129 70 123 82C119 88 113 84 111 75C107 65 104 52 110 44Z',
    'M135 45C141 43 147 47 145 53C143 57 137 57 135 53C133 49 133 47 135 45Z',
    'M145 50C151 47 160 49 160 55C158 62 154 68 151 72C148 66 145 59 145 50Z',
    'M131 25C143 16 160 19 164 28C166 36 160 43 149 45C141 45 135 40 131 34Z',
    'M152 78C158 75 165 78 163 84C160 88 154 87 152 83Z',
  ].join('');
  const regions: { label: string; x: number; y: number; lx: number; ly: number }[] = [
    { label: 'N. AMERICA', x: 34, y: 74, lx: 34, ly: 94 },
    { label: 'EUROPE', x: 66, y: 126, lx: 66, ly: 146 },
    { label: 'MIDDLE EAST', x: 206, y: 50, lx: 206, ly: 70 },
    { label: 'APAC', x: 182, y: 126, lx: 182, ly: 146 },
  ];
  const cluster = (x: number, y: number) => {
    const q = makeIso(x, y - 2, .55);
    return (
      <g>
        <Tower p={q} id={id} x={-7} y={-5} w={6} d={6} h={30} floors={5} cols={2} />
        <Tower p={q} id={id} x={1} y={-7} w={6} d={6} h={20} floors={4} cols={2} />
        <Tower p={q} id={id} x={-3} y={3} w={6} d={6} h={14} floors={3} cols={2} glass={false} />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 240 160" role="presentation" aria-hidden="true">
      <Defs id={id} />
      <defs>
        <radialGradient id={`${id}-globe`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#B4E3FF" /><stop offset=".42" stopColor="#2BA5FF" /><stop offset="1" stopColor="#1B4A86" />
        </radialGradient>
        <clipPath id={`${id}-clip`}><circle cx={cx} cy={cy} r={R} /></clipPath>
        <pattern id={`${id}-dots`} width="3.1" height="3.1" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".72" fill="#FFFFFF" /></pattern>
      </defs>

      <circle cx={cx} cy={cy} r={R + 16} fill={`url(#${id}-glow)`} />
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-globe)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <path d={continents} fill={`url(#${id}-dots)`} opacity=".62" />
        <g fill="none" stroke="#FFFFFF" strokeOpacity=".16" strokeWidth=".6">
          {[-24, -8, 8, 24].map(dy => <ellipse key={`p${dy}`} cx={cx} cy={cy + dy} rx={r1(Math.sqrt(R * R - dy * dy))} ry={r1(Math.sqrt(R * R - dy * dy) * .22)} />)}
          {[14, 28, 38].map(dx => <ellipse key={`m${dx}`} cx={cx} cy={cy} rx={dx} ry={R} />)}
          <path d={`M${cx} ${cy - R}V${cy + R}`} />
        </g>
        <ellipse cx={cx - 15} cy={cy - 19} rx="15" ry="9" fill="#FFFFFF" opacity=".2" filter={`url(#${id}-blur)`} />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth=".8" />

      {/* pedestals for the four headquarters regions */}
      {regions.map(g => (
        <g key={g.label}>
          <ellipse cx={g.x} cy={g.y + 3} rx="18" ry="6.2" fill={`url(#${id}-sr)`} />
          <ellipse cx={g.x} cy={g.y} rx="18" ry="6.2" fill="#FFFFFF" stroke={STEEL} strokeWidth=".6" />
          {cluster(g.x, g.y)}
          <text x={g.lx} y={g.ly} textAnchor="middle" fontSize="7.4" fontWeight="700" letterSpacing=".45" fill={NAVY_MID}>{g.label}</text>
        </g>
      ))}

      {/* every route lands in the same place */}
      <g fill="none" strokeLinecap="round">
        {regions.map(g => {
          const sx = g.x, sy = g.y - 16;
          const mx = (sx + hyd[0]) / 2, my = Math.min(sy, hyd[1]) - 26;
          return (
            <g key={`a${g.label}`}>
              <path d={`M${sx} ${sy}Q${r1(mx)} ${r1(my)} ${hyd[0]} ${hyd[1]}`} stroke={BLUE_LIGHT} strokeWidth="3" opacity=".22" />
              <path d={`M${sx} ${sy}Q${r1(mx)} ${r1(my)} ${hyd[0]} ${hyd[1]}`} stroke="#DCF3FF" strokeWidth="1.05" />
              <circle cx={sx} cy={sy} r="1.8" fill={BLUE} stroke="none" />
            </g>
          );
        })}
      </g>

      {/* Hyderabad */}
      <circle cx={hyd[0]} cy={hyd[1]} r="10" fill="#FFFFFF" opacity=".16" />
      <circle cx={hyd[0]} cy={hyd[1]} r="6.2" fill="none" stroke="#FFFFFF" strokeOpacity=".75" strokeWidth=".9" />
      <circle cx={hyd[0]} cy={hyd[1]} r="3" fill="#FFFFFF" />
      <g>
        <rect x="136" y="80" width="50" height="14" rx="7" fill={NAVY} />
        <text x="161" y="89.6" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing=".5" fill="#FFFFFF">HYDERABAD</text>
      </g>
    </svg>
  );
}

/* ================================================================
   04 — You keep control: the client runs the center; ownership stays with them
   ================================================================ */
function Control() {
  const id = 'wg-ctl';
  const p = makeIso(76, 58, 1.25);
  // the dashboard stands on the plane y = 4, facing the viewer; content is drawn in panel coordinates
  const panelX = 2, panelY = 4, panelTop = 46, panelW = 56, panelH = 30;
  const [ex, ey] = p(panelX, panelY, panelTop);
  const face = `matrix(${r1(CO * p.k * 1000) / 1000} ${r1(SI * p.k * 1000) / 1000} 0 ${p.k} ${r1(ex)} ${r1(ey)})`;
  const chips = ['Your entity', 'Your people', 'Your IP'];
  const [hx, hy] = p(29, 40, 27.6);
  return (
    <svg viewBox="0 0 240 160" role="presentation" aria-hidden="true">
      <Defs id={id} />
      <ellipse cx="88" cy="108" rx="92" ry="32" fill={`url(#${id}-glow)`} />

      {/* the floor */}
      <path d={poly(p(0, 48, -3), p(60, 48, -3), p(60, 48, 0), p(0, 48, 0))} fill={`url(#${id}-sl)`} />
      <path d={poly(p(60, 48, -3), p(60, 0, -3), p(60, 0, 0), p(60, 48, 0))} fill={`url(#${id}-sr)`} />
      <path d={poly(p(0, 0), p(60, 0), p(60, 48), p(0, 48))} fill={`url(#${id}-st)`} stroke={EDGE} strokeWidth=".6" />
      <path d={open(p(0, 48), p(60, 48), p(60, 0))} fill="none" stroke="#8DD5FF" strokeWidth=".9" />

      {/* the dashboard */}
      <path d={seg(p(30, panelY, 0), p(30, panelY, panelTop - panelH))} stroke={EDGE} strokeWidth="1.6" />
      <g transform={face}>
        <rect x="0" y="0" width={panelW} height={panelH} rx="3" fill="#FFFFFF" fillOpacity=".86" stroke={STEEL} strokeWidth=".7" />
        <rect x="4" y="4" width="18" height="2.6" rx="1.3" fill={NAVY_MID} opacity=".5" />
        <rect x="4" y="9" width="11" height="1.8" rx=".9" fill={STEEL} />
        {[[5, 8], [10, 12], [15, 10], [20, 14], [25, 17]].map(([x, h]) => <rect key={x} x={x} y={26 - h} width="3.4" height={h} rx=".9" fill={`url(#${id}-blue)`} />)}
        <path d="M31 22 L36 17 L41 19 L47 11 L52 13" fill="none" stroke={BLUE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="47" cy="11" r="1.5" fill={BLUE} />
        <path d="M31 26h21" stroke={STEEL} strokeWidth=".8" />
      </g>

      {/* the desk */}
      <Box p={p} x={10} y={14} w={2} d={20} h={15} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />
      <Box p={p} x={44} y={14} w={2} d={20} h={15} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />
      <Box p={p} x={9} y={13} w={38} d={22} h={2} z={15} top="#FFFFFF" left="#F2F9FF" right="#D6EAFA" />
      <Box p={p} x={21} y={19} w={16} d={9} h={.8} z={17} top="#DCEEFB" left="#C9E3F6" right="#B8D8F0" />

      {/* the client, at their own desk */}
      <Box p={p} x={28.4} y={40} w={1.2} d={1.2} h={8} top="#FFFFFF" left="#E6F3FD" right="#C9E1F4" />
      <Box p={p} x={24} y={36} w={10} d={9.5} h={2} z={8} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />
      <Box p={p} x={25} y={36.8} w={8} d={6} h={13.5} z={10} top="#2D5594" left={`url(#${id}-deep)`} right={NAVY} edge="none" />
      <path d={open(p(26, 37.5, 21), p(24, 30, 17.4), p(26, 27, 17.4))} fill="none" stroke={NAVY_MID} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={open(p(32, 37.5, 21), p(34, 29, 17.4), p(31.5, 26.5, 17.4))} fill="none" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={seg(p(29, 40, 23.4), p(29, 40, 25))} stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={r1(hx)} cy={r1(hy)} r="4.3" fill="#E6F3FD" />
      <circle cx={r1(hx + 1.2)} cy={r1(hy - .5)} r="4.2" fill={NAVY} />
      <Box p={p} x={24} y={45.5} w={10} d={1.4} h={8.5} z={10} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />

      {/* a plant, for the office that is theirs */}
      <Box p={p} x={50} y={38} w={5} d={5} h={5} top="#FFFFFF" left={`url(#${id}-wl)`} right={`url(#${id}-wr)`} />
      {[[-3, -12, 5], [3, -13, 4.4], [0, -17, 4.6]].map(([dx, dy, r], i) => {
        const [bx, by] = p(52.5, 40.5, 5);
        return <ellipse key={i} cx={r1(bx + dx)} cy={r1(by + dy + 5)} rx={r} ry={r * 1.25} fill={`url(#${id}-tree)`} stroke={EDGE} strokeWidth=".45" />;
      })}

      {/* ownership stays with the client */}
      <path d="M152 42V106" stroke={STEEL} strokeWidth="1" strokeDasharray="2 2.5" />
      {chips.map((c, i) => {
        const y = 30 + i * 32;
        return (
          <g key={c}>
            <rect x="154" y={y} width="83" height="24" rx="8" fill="#FFFFFF" stroke={STEEL} />
            <circle cx="165.5" cy={y + 12} r="6.2" fill={`url(#${id}-deep)`} />
            <path d={`M162.6 ${y + 12.2}l2.1 2.1 3.8 -4.1`} stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="176" y={y + 15.5} fontSize="9.3" fontWeight="700" fill={NAVY}>{c}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function WhyGccArt({ name }: { name: string }) {
  if (name === 'hyderabad') return <Hyderabad />;
  if (name === 'partner') return <OnePartner />;
  if (name === 'global') return <AnyHQ />;
  return <Control />;
}
