import { useEffect, useState } from 'react';
import useMotionEnabled from '@/hooks/useMotionEnabled';

export default function HeroVideo({
  src = '/videos/hero-cosmetic.mp4',
  poster = '/images/hero/hero-cosmetic-poster.webp',
  className = '',
}) {
  const reduce = !useMotionEnabled();
  const [allowed, setAllowed] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (navigator.connection?.saveData) setAllowed(false);
  }, []);

  if (reduce || failed || !allowed) {
    return <img src={poster} alt="" className={`h-full w-full object-cover object-center ${className}`} aria-hidden="true" />;
  }

  return (
    <div className={`relative h-full w-full overflow-hidden bg-navy-950 ${className}`}>
      <img src={poster} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`} />
      <video autoPlay muted loop playsInline preload="metadata" poster={poster} tabIndex={-1} aria-hidden="true" disablePictureInPicture onCanPlay={() => setReady(true)} onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
