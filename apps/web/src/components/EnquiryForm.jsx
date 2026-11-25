import { useCallback, useState } from 'react';
import FormField from './FormField';
import Turnstile from './Turnstile';
import Button from './Button';
import { request } from '@/services/api';

// Config-driven form used by contact / quote / sample / technical enquiry pages.
export default function EnquiryForm({ fields, endpoint, submitLabel, initial = {}, multipart = false }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [token, setToken] = useState('');
  const onToken = useCallback((t) => setToken(t), []);

  const set = (name, v) => { setValues((s) => ({ ...s, [name]: v })); setErrors((e) => ({ ...e, [name]: undefined })); };

  const validate = () => {
    const e = {};
    fields.forEach((f) => {
      const v = values[f.name];
      if (f.required && !String(v ?? '').trim()) e[f.name] = `${f.label} is required`;
      else if (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) e[f.name] = 'Enter a valid email address';
    });
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { document.querySelector('[aria-invalid="true"]')?.focus(); return; }
    setStatus({ state: 'sending', message: '' });
    try {
      let body;
      if (multipart) {
        body = new FormData();
        Object.entries({ ...values, turnstileToken: token }).forEach(([k, v]) => v && body.append(k, v));
      } else body = { ...values, turnstileToken: token || undefined };
      const res = await request(endpoint, { method: 'POST', body });
      setStatus({ state: 'done', message: res.data.message });
      setValues(initial);
    } catch (err) {
      if (err.details) setErrors(Object.fromEntries(Object.entries(err.details).map(([k, v]) => [k, v[0]])));
      setStatus({ state: 'error', message: err.message });
    }
  };

  if (status.state === 'done') {
    return (
      <div role="status" className="rounded-2xl border border-cyan/40 bg-cyan/10 p-8">
        <h3 className="text-2xl font-semibold">Request sent</h3>
        <p className="mt-2 text-mist-600">{status.message}</p>
        <Button variant="outlineDark" className="mt-6" onClick={() => setStatus({ state: 'idle', message: '' })}>Send another request</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => <FormField key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={set} />)}
      <Turnstile onToken={onToken} />
      <div className="sm:col-span-2">
        {status.state === 'error' && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{status.message}</p>}
        <Button type="submit" size="lg" disabled={status.state === 'sending'}>{status.state === 'sending' ? 'Sending' : submitLabel}</Button>
      </div>
    </form>
  );
}
