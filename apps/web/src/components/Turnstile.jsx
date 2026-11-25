import { useEffect, useRef } from 'react';
import { TURNSTILE_KEY } from '@/config/site';

// Renders the Cloudflare Turnstile widget only when a site key is configured.
export default function Turnstile({ onToken }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!TURNSTILE_KEY) return undefined;
    const render = () => window.turnstile?.render(ref.current, { sitekey: TURNSTILE_KEY, callback: onToken, 'expired-callback': () => onToken('') });
    if (window.turnstile) render();
    else {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true; s.onload = render; document.head.appendChild(s);
    }
    return undefined;
  }, [onToken]);
  return TURNSTILE_KEY ? <div ref={ref} className="sm:col-span-2" /> : null;
}
