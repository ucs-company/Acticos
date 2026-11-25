import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScrollProgress from '@/components/ScrollProgress';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import { useEffect } from 'react';

const PageLoading = () => (
  <div className="grid min-h-[80vh] place-items-center bg-navy-900" role="status" aria-live="polite">
    <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-cyan" />
    <span className="sr-only">Loading page</span>
  </div>
);

export default function MainLayout() {
  const { pathname } = useLocation();
  const reduce = !useMotionEnabled();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<PageLoading />}>
            <motion.div
              key={pathname}
              initial={reduce ? false : { y: 10 }}
              animate={reduce ? undefined : { y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
