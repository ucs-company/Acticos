import { useEffect, useState } from 'react';
import useMotionEnabled from '@/hooks/useMotionEnabled';

export default function HeroVideo({
  src = '/videos/hero.mp4',
  poster = '/images/applications/skin-care.webp',
  alt = 'Macro skincare ingredient texture',
  className = '',
}) {
  const reduce = !useMotionEnabled();
  const [failed, setFailed] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    if (navigator.connection?.saveData) setAllowed(false);
  }, []);

  if (reduce || failed || !allowed) {
    return <img src={poster} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <video className={`h-full w-full object-cover ${className}`} autoPlay muted loop playsInline preload="metadata" poster={poster} aria-label={alt} onError={() => setFailed(true)}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
