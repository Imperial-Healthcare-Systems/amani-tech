import Image from 'next/image';
import { Enter } from './motion';
import { HomeHeroArt } from './HomeHeroArt';

/** Hero illustration. With no image set in Admin → Website CMS → Hero we draw the company itself:
 *  two offices, four practices, worldwide delivery. Set an image there to use a photo instead. */
export function HeroVisual({ image }: { image?: string }) {
  return (
    <Enter delay={0.2} className="hero-visual">
      {image
        ? <Image src={image} alt="Amani Tech" width={1334} height={1179} priority sizes="(max-width:1023px) 100vw, 60vw" />
        : <HomeHeroArt />}
    </Enter>
  );
}
