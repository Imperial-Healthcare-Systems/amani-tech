import Image from 'next/image';
import { Enter } from './motion';

const DEFAULT = '/hero_section/hero_img.png';

/** Hero illustration: the candidate journey composed as one image. Swappable in Admin → Website CMS → Hero. */
export function HeroVisual({ image }: { image?: string }) {
  return (
    <Enter delay={0.2} className="hero-visual">
      <Image src={image || DEFAULT} alt="The Amani Tech candidate journey: profile submitted, profile review, assessment, resume optimisation, job matching, interviews and placement" width={1334} height={1179} priority sizes="(max-width:1023px) 100vw, 60vw" />
    </Enter>
  );
}
