/** Duotone category illustrations (navy strokes, electric-blue and lavender accents), keyed by category slug. */

function gear(cx: number, cy: number, ro: number, ri: number, teeth: number) {
  const step = (Math.PI * 2) / teeth;
  const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i ? 'L' : 'M'}${p(ri, a - step * 0.3)} L${p(ro, a - step * 0.17)} L${p(ro, a + step * 0.17)} L${p(ri, a + step * 0.3)} `;
  }
  return d + 'Z';
}

const ART: Record<string, React.ReactNode> = {
  it: (
    <>
      <path className="n" d="M20 20 8 32l12 12M44 20l12 12-12 12" />
      <path className="n" d="M32 18v9c0 6-3 8-6 11v8M32 27c0 5 3 5 8 5" />
      <circle className="bf" cx="32" cy="14" r="4" />
      <circle className="lf b" cx="40" cy="32" r="3.5" />
      <circle className="lf n" cx="26" cy="50" r="4" />
    </>
  ),
  finance: (
    <>
      <rect className="lf" x="38" y="26" width="6" height="12" rx="1.5" />
      <rect className="lf" x="46" y="18" width="6" height="20" rx="1.5" />
      <path className="b" d="M30 30c6-8 14-14 24-18M48 10l6 2-2 6" />
      <ellipse className="n sf" cx="24" cy="30" rx="12" ry="5" />
      <path className="n" d="M12 30v8c0 3 5 5 12 5 3.5 0 6.5-.5 9-1.3M12 38v8c0 3 5 5 12 5 2.5 0 4.8-.2 6.8-.7" />
      <circle className="n wf" cx="42" cy="44" r="11" />
      <path className="n" d="M38 38h9M38 42h9M41 38c3.6 0 5.5 1.6 5.5 4s-1.9 4-5.5 4h-1.5l6.5 6" />
    </>
  ),
  engineering: (
    <>
      <path className="n wf" d={gear(26, 32, 18, 13.5, 8)} />
      <circle className="b sf" cx="26" cy="32" r="7" />
      <path className="n" d="M33 32h10l6-6h3M43 32l6 6h3" />
      <circle className="bf" cx="54" cy="26" r="3.5" />
      <circle className="lf b" cx="54" cy="38" r="3.5" />
    </>
  ),
  operations: (
    <>
      <path className="n sf" d="M32 8l12 6v12l-12 6-12-6V14z" />
      <path className="lf" d="M32 8l12 6-12 6-12-6z" />
      <path className="n" d="M20 14l12 6 12-6M32 20v12" />
      <path className="b" d="M32 32v8M16 40h32M16 42v2M48 42v2" />
      <circle className="bf" cx="16" cy="40" r="2.8" />
      <circle className="bf" cx="48" cy="40" r="2.8" />
      <circle className="lf b" cx="32" cy="40" r="2.8" />
      <path className="n lf" d="M16 44l8 4v8l-8 4-8-4v-8zM48 44l8 4v8l-8 4-8-4v-8z" />
      <path className="n" d="M8 48l8 4 8-4M16 52v8M40 48l8 4 8-4M48 52v8" />
    </>
  ),
  sales: (
    <>
      <rect className="n wf" x="10" y="16" width="40" height="30" rx="2" />
      <path className="n" d="M8 16h44M30 46l-6 12M30 46l6 12" />
      <rect className="lf" x="16" y="34" width="5" height="8" rx="1" />
      <rect className="lf" x="24" y="30" width="5" height="12" rx="1" />
      <rect className="lf" x="32" y="26" width="5" height="16" rx="1" />
      <rect className="lf" x="40" y="22" width="5" height="20" rx="1" />
      <path className="b" d="M15 33c9-4 19-10 35-23M44 9l6 1-1 6" />
    </>
  ),
  hr: (
    <>
      <circle className="n wf" cx="18" cy="24" r="4.5" />
      <circle className="n wf" cx="46" cy="24" r="4.5" />
      <path className="n" d="M9 38c0-5 4-9 9-9 2 0 3.5.5 5 1.4M55 38c0-5-4-9-9-9-2 0-3.5.5-5 1.4" />
      <circle className="b sf" cx="32" cy="20" r="6" />
      <path className="bf" d="M22 40c0-6 4-10 10-10s10 4 10 10v1H22z" />
      <path className="b" d="M32 42v5M16 47h32M16 47v5M48 47v5" />
      <circle className="lf b" cx="16" cy="54" r="3" />
      <circle className="bf" cx="32" cy="54" r="3.5" />
      <circle className="lf b" cx="48" cy="54" r="3" />
    </>
  ),
};

export const hasCatArt = (slug: string) => slug in ART;

export function CatArt({ slug, className = 'cat-art' }: { slug: string; className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" aria-hidden="true">{ART[slug]}</svg>;
}
