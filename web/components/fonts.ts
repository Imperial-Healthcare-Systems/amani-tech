import { Caveat } from 'next/font/google';

/** Handwritten accent for decorative annotations only. Apply `hand.variable` on a section to expose `--font-hand` there. */
export const hand = Caveat({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-hand', display: 'swap' });
