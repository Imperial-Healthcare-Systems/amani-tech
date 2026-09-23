import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icon';
import s from './GccHero.module.css';

/** The GCC practice hero: a photograph of the Hyderabad waterfront district behind live text,
 *  darkened on the left so the headline stays readable and left clear on the right. */
export function GccHero() {
  return (
    <section className={s.hero} aria-labelledby="gcc-hero-title">
      <Image src="/gcc/hero.png" alt="" fill priority sizes="100vw" quality={88} className={s.photo} />
      <span className={s.tint} aria-hidden="true" />

      <div className={`container ${s.inner}`}>
        <div className={s.content}>
          <span className={`${s.eyebrow} ${s.up} ${s.d1}`}>GCC Practice</span>
          <h1 id="gcc-hero-title" className={`${s.title} ${s.up} ${s.d2}`}>
            Your Global Capability Center in Hyderabad, landed end to end
          </h1>
          <p className={`${s.lead} ${s.up} ${s.d3}`}>
            We do not simply supply talent to GCCs. For companies worldwide — from North America to Europe, the Middle East
            and APAC — we are the landing partner: incorporation, office, compliances, permissions and the team, under one
            roof and on one plan.
          </p>
          <div className={`${s.actions} ${s.up} ${s.d4}`}>
            <Link className={`btn btn-primary btn-lg ${s.primary}`} href="/contact">
              Plan your GCC <Icon name="arrow" className={s.arrow} />
            </Link>
            <Link className={`btn btn-outline-light btn-lg ${s.secondary}`} href="#scope">
              What we cover <Icon name="arrow" className={s.arrow} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
