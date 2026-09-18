'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CANDIDATE_STEPS, EMPLOYER_STEPS, Steps } from './cards';

export function HowItWorks() {
  const [tab, setTab] = useState<'c' | 'e'>('c');
  return (
    <>
      <div className="center">
        <div className="tabs" role="tablist" aria-label="How it works">
          <button className="tab" role="tab" aria-selected={tab === 'c'} aria-controls="hiw-c" onClick={() => setTab('c')}>For job seekers</button>
          <button className="tab" role="tab" aria-selected={tab === 'e'} aria-controls="hiw-e" onClick={() => setTab('e')}>For employers</button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} id={tab === 'c' ? 'hiw-c' : 'hiw-e'} role="tabpanel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          <Steps items={tab === 'c' ? CANDIDATE_STEPS : EMPLOYER_STEPS} />
          <p className="center mt-32">{tab === 'c' ? <Link className="btn btn-primary" href="/jobs">Find Jobs</Link> : <Link className="btn btn-outline" href="/employers#request-talent">Request Talent</Link>}</p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
