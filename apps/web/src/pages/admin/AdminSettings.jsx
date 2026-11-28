import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/services/admin';
import Button from '@/components/Button';

const blank = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function AdminSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState(blank);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setSaved('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('Use at least 8 characters');
      return;
    }

    setBusy(true);
    try {
      await admin.changePassword(form);
      setForm(blank);
      setSaved('Password updated successfully.');
    } catch (err) {
      setError(err.message || 'Could not update the password. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputType = show ? 'text' : 'password';

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-mist-600">Manage your admin account password.</p>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold">Account</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-mist-600">Name</dt>
            <dd className="mt-1 text-sm text-ink">{user?.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-mist-600">Email</dt>
            <dd className="mt-1 break-all text-sm text-ink">{user?.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-mist-600">Role</dt>
            <dd className="mt-1 text-sm text-ink">{user?.role || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-mist-600">Use at least 8 characters. You will keep your current session.</p>

        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <div>
            <label htmlFor="current-password" className="mb-1 block text-sm font-medium">Current password</label>
            <input id="current-password" type={inputType} className="field" autoComplete="current-password" value={form.currentPassword} onChange={setField('currentPassword')} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm font-medium">New password</label>
              <input id="new-password" type={inputType} className="field" autoComplete="new-password" placeholder="At least 8 characters" value={form.newPassword} onChange={setField('newPassword')} required minLength={8} />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">Confirm new password</label>
              <input id="confirm-password" type={inputType} className={`field ${form.confirmPassword && form.confirmPassword !== form.newPassword ? 'field-error' : ''}`} autoComplete="new-password" value={form.confirmPassword} onChange={setField('confirmPassword')} required />
            </div>
          </div>

          <label className="flex w-fit items-center gap-2 text-sm text-mist-600">
            <input type="checkbox" className="h-4 w-4" checked={show} onChange={(event) => setShow(event.target.checked)} />
            Show passwords
          </label>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
          {saved && <p className="rounded-lg bg-electric/10 px-4 py-3 text-sm text-electric" role="status">{saved}</p>}

          <div>
            <Button type="submit" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
