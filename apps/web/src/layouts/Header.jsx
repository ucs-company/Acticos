import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV } from '@/config/site';
import { useScrolled } from '@/hooks/useHeaderState';
import Logo from '@/components/Logo';
import Button from '@/components/Button';

export default function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const closeRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const solid = scrolled || open;
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-navy-900/95 shadow-[0_1px_0_rgba(255,255,255,.08)] backdrop-blur-md' : 'bg-transparent'}`}>
        <div className={`container-page flex items-center justify-between text-white transition-all duration-300 ${solid ? 'h-16' : 'h-20'}`}>
          <Link to="/" aria-label="Acticos home"><Logo /></Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className="relative px-3.5 py-2 text-[15px] text-white/75 transition-colors hover:text-white aria-[current=page]:text-white">
                {n.label}
                {isActive(n.to) && <motion.span layoutId="nav-indicator" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded bg-cyan" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block"><Button to="/request-quote" size="md">Request a Quote</Button></div>

          <button className="grid h-11 w-11 place-items-center rounded-full lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-nav">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.aside id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-navy-900 p-6 text-white lg:hidden"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.28 }}>
              <div className="flex items-center justify-between">
                <Logo />
                <button ref={closeRef} onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full" aria-label="Close menu">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-8 flex flex-1 flex-col">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.to === '/'} className={`flex min-h-[56px] items-center border-b border-white/10 font-display text-2xl ${isActive(n.to) ? 'text-cyan' : 'text-white'}`}>{n.label}</NavLink>
                ))}
              </nav>
              <div className="mt-6 grid gap-3">
                <Button to="/request-quote" size="lg">Request a Quote</Button>
                <Button to="/request-sample" variant="outline" size="lg">Request a Sample</Button>
                <Button to="/technical-enquiry" variant="outline" size="lg">Technical Enquiry</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
