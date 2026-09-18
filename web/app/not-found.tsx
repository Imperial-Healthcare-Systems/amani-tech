import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="container" style={{ padding: '96px 16px', textAlign: 'center', maxWidth: 560 }}>
      <span className="eyebrow">404</span>
      <h1 style={{ fontSize: 'var(--fs-4xl)' }}>We couldn&apos;t find that page</h1>
      <p className="lead" style={{ marginBottom: 24 }}>The job or page may have closed or moved. Try the job board or head home.</p>
      <div className="row" style={{ justifyContent: 'center' }}><Link className="btn btn-primary" href="/jobs">Find Jobs</Link><Link className="btn btn-outline" href="/">Back to home</Link></div>
    </main>
  );
}
