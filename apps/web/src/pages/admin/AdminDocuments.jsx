import { useRef, useState } from 'react';
import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import Button from '@/components/Button';

const TYPES = [
  ['TDS', 'TDS'],
  ['SDS', 'SDS'],
  ['CATALOGUE', 'Catalogue'],
  ['APPLICATION_NOTE', 'Application note'],
  ['FORMULATION_GUIDE', 'Formulation guide'],
  ['OTHER', 'Other'],
];

const blank = { title: '', type: 'TDS', productId: '' };

export default function AdminDocuments() {
  const { user } = useAuth();
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const fileRef = useRef(null);
  const list = useAsync(() => admin.list('documents'), []);
  const products = useAsync(() => admin.products({ pageSize: 60 }), []);
  const canDelete = user.role !== 'EDITOR';

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const upload = async (event) => {
    event.preventDefault();
    if (!file) {
      setErr(new Error('Select a PDF, PNG or JPG file'));
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const body = new FormData();
      body.append('title', form.title);
      body.append('type', form.type);
      if (form.productId) body.append('productId', form.productId);
      body.append('file', file);
      await admin.uploadDocument(body);
      setForm(blank);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      list.reload();
    } catch (error) {
      setErr(error);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id, title) => {
    if (!confirm(`Delete ${title}?`)) return;
    try {
      await admin.remove('documents', id);
      list.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Documents</h1>
      <p className="mt-2 max-w-2xl text-mist-600">Upload TDS, SDS, catalogues and formulation guides. Files are stored in R2 and listed on the public Resources page.</p>

      <form onSubmit={upload} className="mt-6 grid gap-4 rounded-2xl bg-white p-6 md:grid-cols-2">
        <div><label htmlFor="doc-title" className="mb-1 block text-sm font-medium">Title</label><input id="doc-title" required className="field" value={form.title} onChange={(event) => set('title', event.target.value)} /></div>
        <div><label htmlFor="doc-type" className="mb-1 block text-sm font-medium">Type</label><select id="doc-type" className="field" value={form.type} onChange={(event) => set('type', event.target.value)}>{TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div>
          <label htmlFor="doc-product" className="mb-1 block text-sm font-medium">Product (optional)</label>
          <select id="doc-product" className="field" value={form.productId} onChange={(event) => set('productId', event.target.value)}>
            <option value="">No product</option>
            {(products.data || []).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </div>
        <div><label htmlFor="doc-file" className="mb-1 block text-sm font-medium">File</label><input ref={fileRef} id="doc-file" type="file" accept=".pdf,.png,.jpg,.jpeg" className="field" onChange={(event) => setFile(event.target.files?.[0] || null)} /></div>
        {err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800 md:col-span-2">{err.message}</p>}
        <div className="md:col-span-2"><Button type="submit" disabled={busy}>{busy ? 'Uploading' : 'Upload document'}</Button></div>
      </form>

      <div className="mt-8">
        {list.loading ? <Loading /> : list.error ? <ErrorState error={list.error} onRetry={list.reload} /> : !list.data?.length ? <EmptyState title="No documents yet" text="Upload the first product document." /> : (
          <div className="overflow-x-auto rounded-2xl bg-white">
            <table className="w-full text-left text-[15px]">
              <thead className="border-b border-ink/10 text-sm text-mist-600"><tr><th className="p-4">Title</th><th className="p-4">Type</th><th className="p-4">Product</th><th className="p-4">File</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-ink/10">
                {list.data.map((document) => (
                  <tr key={document.id}>
                    <td className="p-4 font-medium">{document.title}</td>
                    <td className="p-4">{document.type}</td>
                    <td className="p-4">{document.productName || '—'}</td>
                    <td className="p-4">{document.fileUrl ? <a className="text-electric hover:underline" href={document.fileUrl} target="_blank" rel="noreferrer">Open</a> : '—'}</td>
                    <td className="p-4 text-right">{canDelete && <button className="text-sm font-medium text-red-600" onClick={() => remove(document.id, document.title)}>Delete</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
