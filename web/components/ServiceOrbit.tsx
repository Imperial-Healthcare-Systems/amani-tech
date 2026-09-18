import Link from 'next/link';
import { Icon, LogoMark } from './Icon';
import { Item, Stagger } from './motion';
import type { Service } from '@/lib/types';

/** Restrained per-node accents (icon, dot, hover only). Brand navy + blue stays primary. */
const ACCENTS = ['#2563EB', '#7C3AED', '#0E9F6E', '#EA580C'];
const POS = ['n-tl', 'n-tr', 'n-bl', 'n-br'];
// SVG space is 600×560. Paths run from the emblem to a point under each card; nodes sit 55% along each path.
const PATHS = [[300, 280, 150, 110], [300, 280, 450, 110], [300, 280, 150, 450], [300, 280, 450, 450]];

/** Service ecosystem: central brand emblem, orbital rings, dotted paths and four floating service cards. */
export function ServiceOrbit({ services }: { services: Service[] }) {
  const nodes = services.slice(0, 4);
  return (
    <Stagger className="orbit">
      <Item className="orbit-lines-wrap">
        <svg className="orbit-lines" viewBox="0 0 600 560" preserveAspectRatio="none" aria-hidden="true">
          <circle className="ring ring-a" cx="300" cy="280" r="232" />
          <circle className="ring ring-b" cx="300" cy="280" r="150" />
          <g className="orbiter"><circle cx="300" cy="48" r="4" /></g>
          {nodes.map((s, i) => {
            const [x1, y1, x2, y2] = PATHS[i];
            return (
              <g key={s.id} style={{ color: ACCENTS[i] }}>
                <path className="path" d={`M${x1} ${y1} L${x2} ${y2}`} style={{ animationDelay: `${i * -0.75}s` }} />
                <circle className="node" cx={x1 + (x2 - x1) * 0.55} cy={y1 + (y2 - y1) * 0.55} r="4" style={{ animationDelay: `${i * 0.65}s` }} />
              </g>
            );
          })}
        </svg>
      </Item>

      <Item className="orbit-core-wrap">
        <div className="orbit-core" aria-hidden="true">
          <LogoMark size={44} />
          <b>amani tech</b>
          <small>Staffing ecosystem</small>
        </div>
      </Item>

      {nodes.map((s, i) => (
        <Item key={s.id} className={`orbit-node ${POS[i]}`}>
          <div className="orbit-float" style={{ animationDelay: `${i * -1.75}s` }}>
            <Link className="orbit-card" href={`/services/${s.slug}`} style={{ '--c': ACCENTS[i] } as React.CSSProperties}>
              <span className="oc-ico"><Icon name={s.icon || 'briefcase'} /></span>
              <strong>{s.title}</strong>
              <small>{s.short_description}</small>
              <span className="oc-arrow" aria-hidden="true"><Icon name="arrow" /></span>
            </Link>
          </div>
        </Item>
      ))}
    </Stagger>
  );
}
