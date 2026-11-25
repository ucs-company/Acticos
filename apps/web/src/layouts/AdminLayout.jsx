import { useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';
import Seo from '@/components/Seo';

export const ADMIN_NAV = [
  ['Dashboard', ''], ['Products', 'products'], ['Categories', 'categories'], ['Applications', 'applications'], ['Solutions', 'solutions'],
  ['Documents', 'documents'], ['Resources', 'resources'], ['Blog', 'blog'], ['Quotes', 'inbox/quotes'], ['Sample Requests', 'inbox/samples'],
  ['Technical Enquiries', 'inbox/technical'], ['Contact Messages', 'inbox/contact'], ['SEO', 'seo'], ['Settings', 'settings'],
];

export default function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!ready) return <div className="grid min-h-screen place-items-center">Loading</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[260px_1fr]">
      <Seo title="Admin" noindex />
      <aside className={`${open ? 'block' : 'hidden'} bg-navy-900 p-5 text-white lg:block`}>
        <Logo className="mb-6" />
        <nav aria-label="Admin" className="space-y-0.5">
          {ADMIN_NAV.map(([label, to]) => (
            <NavLink key={to} end={to === ''} to={`/admin/${to}`} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-[15px] ${isActive ? 'bg-electric text-white' : 'text-white/70 hover:bg-white/10'}`}>{label}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-3">
          <button className="rounded-lg border border-ink/15 px-3 py-2 text-sm lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Menu</button>
          <p className="ml-auto mr-4 text-sm text-mist-600">{user.name} <span className="rounded bg-mist px-2 py-0.5 text-xs">{user.role}</span></p>
          <button onClick={logout} className="text-sm font-medium text-electric">Sign out</button>
        </header>
        <div className="p-5 md:p-8"><Outlet /></div>
      </div>
    </div>
  );
}
