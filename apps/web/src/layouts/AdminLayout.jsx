import { Suspense, useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';
import Seo from '@/components/Seo';
import ErrorBoundary from '@/components/ErrorBoundary';

export const ADMIN_NAV = [
  ['Dashboard', ''], ['Products', 'products'], ['Categories', 'categories'], ['Applications', 'applications'], ['Solutions', 'solutions'],
  ['Documents', 'documents'], ['Resources', 'resources'], ['Blog', 'blog'], ['Quotes', 'inbox/quotes'], ['Sample Requests', 'inbox/samples'],
  ['Technical Enquiries', 'inbox/technical'], ['Contact Messages', 'inbox/contact'], ['SEO', 'seo'], ['Settings', 'settings'],
];

const AdminPageLoading = () => (
  <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-electric" />
    <span className="sr-only">Loading admin page</span>
  </div>
);

export default function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!ready) return <div className="grid min-h-screen place-items-center">Loading</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-mist">
      <Seo title="Admin" noindex />

      {open && <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-y-auto bg-navy-900 p-5 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
          </button>
        </div>
        <nav aria-label="Admin" className="mt-8 space-y-0.5 pb-6">
          {ADMIN_NAV.map(([label, to]) => (
            <NavLink key={to} end={to === ''} to={`/admin/${to}`} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-[15px] ${isActive ? 'bg-electric text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>{label}</NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ink/10 bg-white/95 px-5 py-3 backdrop-blur">
          <button type="button" className="rounded-lg border border-ink/15 px-3 py-2 text-sm lg:hidden" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="admin-sidebar">Menu</button>
          <p className="ml-auto text-right text-sm text-mist-600"><span className="max-[380px]:hidden">{user.name} </span><span className="rounded bg-mist px-2 py-0.5 text-xs">{user.role}</span></p>
          <button onClick={logout} className="shrink-0 text-sm font-medium text-electric">Sign out</button>
        </header>
        <div className="p-5 md:p-8">
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<AdminPageLoading />}><Outlet /></Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
