import { useEffect } from 'react';
import { SITE } from '@/config/site';

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
};

// Lightweight head manager: title, description, canonical, OG, Twitter, JSON-LD.
export default function Seo({ title, description, path = '', jsonLd, noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;
    const desc = description || 'High-performance specialty ingredients for personal care and cosmetic formulations.';
    const url = `${SITE.url}${path}`;
    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
    let script = document.getElementById('ld-json');
    if (jsonLd) {
      if (!script) { script = document.createElement('script'); script.id = 'ld-json'; script.type = 'application/ld+json'; document.head.appendChild(script); }
      script.textContent = JSON.stringify(jsonLd);
    } else script?.remove();
    return () => document.getElementById('ld-json')?.remove();
  }, [title, description, path, jsonLd, noindex]);
  return null;
}
