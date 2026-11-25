import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Seo from '@/components/Seo';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin" replace />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await login(f.email, f.password); nav('/admin'); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-navy-900 p-5">
      <Seo title="Admin sign in" noindex />
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8">
        <Logo variant="dark" size="lg" />
        <h1 className="mt-6 text-2xl font-semibold">Sign in</h1>
        <label className="mt-6 block text-sm font-medium" htmlFor="em">Email</label>
        <input id="em" type="email" autoComplete="username" required className="field mt-1.5" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <label className="mt-4 block text-sm font-medium" htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="current-password" required className="field mt-1.5" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}
        <Button type="submit" className="mt-6 w-full" disabled={busy}>{busy ? 'Signing in' : 'Sign in'}</Button>
      </form>
    </div>
  );
}
