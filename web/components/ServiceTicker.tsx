import s from './ServiceTicker.module.css';

/** Everything Amani Tech sells, in one running line under the hero — the four practices
 *  unpacked into the services a visitor actually searches for. */
const SERVICES = [
  'Cloud Platforms',
  'Custom Web & App Development',
  'QA Automation',
  'DevOps & CI/CD',
  'Cybersecurity & Data Protection',
  'Applied AI & Analytics',
  'Permanent Recruitment',
  'Contract Staffing',
  'Executive Search',
  'GCC Setup & Advisory',
  'GCC Talent & Staffing',
  'Growth & Operations Automation',
  'AI Process Automation',
  'Corporate Training',
];

export function ServiceTicker({ label = 'Our services' }: { label?: string }) {
  return (
    <div className={s.wrap}>
      <div className={s.band}>
        <span className={s.label}>{label}</span>
        <div className={s.rail}>
          {/* Two copies so the -50% loop lands seamlessly. */}
          <div className={s.track} aria-label={`Our services: ${SERVICES.join(', ')}`}>
            {[...SERVICES, ...SERVICES].map((t, i) => (
              <span key={i} className={s.item} aria-hidden={i >= SERVICES.length}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
