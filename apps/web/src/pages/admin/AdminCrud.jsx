import { useState } from 'react';
import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import Button from '@/components/Button';

const VISUALS = [
  ['preservative', 'Preservative'],
  ['active', 'Active'],
  ['emollient', 'Emollient'],
  ['blend', 'Blend'],
];

const RESOURCES = {
  categories: {
    title: 'Categories',
    singular: 'category',
    blank: { name: '', slug: '', description: '', visual: 'active', sortOrder: 0, seoTitle: '', seoDescription: '' },
    columns: [['Name', 'name'], ['Slug', 'slug'], ['Visual', 'visual'], ['Order', 'sortOrder']],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug', hint: 'Auto-generated from name if blank' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, wide: true },
      { key: 'visual', label: 'Visual', type: 'select', options: VISUALS },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
      { key: 'seoTitle', label: 'SEO title', wide: true },
      { key: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 2, wide: true },
    ],
  },
  applications: {
    title: 'Applications',
    singular: 'application',
    blank: { name: '', slug: '', description: '' },
    columns: [['Name', 'name'], ['Slug', 'slug'], ['Description', 'description']],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug', hint: 'Auto-generated from name if blank' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, wide: true },
    ],
  },
  solutions: {
    title: 'Solutions',
    singular: 'solution',
    blank: { name: '', slug: '', description: '' },
    columns: [['Name', 'name'], ['Slug', 'slug'], ['Description', 'description']],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug', hint: 'Auto-generated from name if blank' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, wide: true },
    ],
  },
  blog: {
    title: 'Blog',
    singular: 'post',
    blank: { title: '', slug: '', excerpt: '', content: '', status: 'DRAFT' },
    columns: [['Title', 'title'], ['Slug', 'slug'], ['Status', 'status']],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'slug', label: 'Slug', hint: 'Auto-generated from title if blank' },
      { key: 'status', label: 'Status', type: 'select', options: [['DRAFT', 'Draft'], ['PUBLISHED', 'Published']] },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, wide: true },
      { key: 'content', label: 'Content', type: 'textarea', rows: 12, required: true, wide: true },
    ],
  },
};

const blankFor = (config) => ({ ...config.blank });

function RecordForm({ config, resource, initial, onClose, onSaved }) {
  const [edit, setEdit] = useState({ ...initial });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (key, value) => setEdit((current) => ({ ...current, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const body = Object.fromEntries(config.fields.map((field) => [field.key, edit[field.key]]));
      await admin.save(resource, initial.id, body);
      onSaved();
    } catch (error) {
      setErr(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={initial.id ? `Edit ${config.singular}` : `Add ${config.singular}`} className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-black/50 p-4">
      <form onSubmit={save} className="mx-auto my-8 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6">
        <h2 className="text-2xl font-semibold">{initial.id ? `Edit ${config.singular}` : `Add ${config.singular}`}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div key={field.key} className={field.wide ? 'sm:col-span-2' : ''}>
              <label htmlFor={`f-${field.key}`} className="mb-1 block text-sm font-medium">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea id={`f-${field.key}`} rows={field.rows || 3} required={field.required} className="field" value={edit[field.key] ?? ''} onChange={(event) => set(field.key, event.target.value)} />
              ) : field.type === 'select' ? (
                <select id={`f-${field.key}`} className="field" value={edit[field.key] ?? ''} onChange={(event) => set(field.key, event.target.value)}>
                  {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              ) : (
                <input id={`f-${field.key}`} type={field.type || 'text'} required={field.required} className="field" value={edit[field.key] ?? ''} onChange={(event) => set(field.key, event.target.value)} />
              )}
              {field.hint && <p className="mt-1 text-xs text-mist-600">{field.hint}</p>}
            </div>
          ))}
        </div>
        {err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{err.message}{err.details && Object.entries(err.details).map(([key, message]) => ` ${key}: ${message}`)}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outlineDark" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save'}</Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminCrud({ resource }) {
  const config = RESOURCES[resource];
  const { user } = useAuth();
  const [edit, setEdit] = useState(null);
  const list = useAsync(() => admin.list(resource), [resource]);
  const canDelete = user.role !== 'EDITOR';
  const act = async (fn) => {
    try {
      await fn();
      list.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!config) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{config.title}</h1>
        <Button onClick={() => setEdit(blankFor(config))}>Add {config.singular}</Button>
      </div>
      <div className="mt-6">
        {list.loading ? <Loading /> : list.error ? <ErrorState error={list.error} onRetry={list.reload} /> : !list.data?.length ? (
          <EmptyState title={`No ${config.title.toLowerCase()} yet`} text={`Add your first ${config.singular}.`} />
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-2xl bg-white md:block">
              <table className="w-full text-left text-[15px]">
                <thead className="border-b border-ink/10 text-sm text-mist-600">
                  <tr>
                    {config.columns.map(([label]) => <th key={label} className="p-4">{label}</th>)}
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {list.data.map((row) => (
                    <tr key={row.id}>
                      {config.columns.map(([label, key]) => <td key={label} className="max-w-xs truncate p-4">{String(row[key] ?? '')}</td>)}
                      <td className="space-x-3 whitespace-nowrap p-4 text-right text-sm font-medium text-electric">
                        <button onClick={() => setEdit({ ...blankFor(config), ...row })}>Edit</button>
                        {canDelete && <button className="text-red-600" onClick={() => confirm(`Delete ${row.name || row.title}?`) && act(() => admin.remove(resource, row.id))}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">
              {list.data.map((row) => (
                <article key={row.id} className="rounded-2xl bg-white p-4">
                  <h2 className="font-semibold">{String(row[config.columns[0][1]] ?? '')}</h2>
                  <dl className="mt-2 grid gap-1 text-sm">
                    {config.columns.slice(1).map(([label, key]) => <div key={label} className="flex gap-2"><dt className="shrink-0 text-mist-600">{label}:</dt><dd className="min-w-0 break-words">{String(row[key] ?? '')}</dd></div>)}
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-electric">
                    <button onClick={() => setEdit({ ...blankFor(config), ...row })}>Edit</button>
                    {canDelete && <button className="text-red-600" onClick={() => confirm(`Delete ${row.name || row.title}?`) && act(() => admin.remove(resource, row.id))}>Delete</button>}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
      {edit && <RecordForm config={config} resource={resource} initial={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
    </div>
  );
}
