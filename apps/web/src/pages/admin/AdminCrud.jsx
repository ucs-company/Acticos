import { useEffect, useState } from 'react';
import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import ImageLightbox from '@/components/ImageLightbox';
import Button from '@/components/Button';
import { cloudinaryImage } from '@/utils/images';

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
    imageUpload: true,
    blank: { name: '', slug: '', description: '', imageUrl: '' },
    columns: [['Name', 'name'], ['Slug', 'slug'], ['Description', 'description']],
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'slug', label: 'Slug', hint: 'Auto-generated from name if blank' },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, wide: true },
      { key: 'imageUrl', label: 'Image URL', hint: 'Cloudinary secure URL', wide: true },
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
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [viewImage, setViewImage] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (key, value) => setEdit((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    if (!file) { setFilePreview(''); return undefined; }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const body = Object.fromEntries(config.fields.map((field) => [field.key, edit[field.key]]));
      const saved = await admin.save(resource, initial.id, body);
      if (config.imageUpload && file) await admin.uploadApplicationImage(saved.data?.id || initial.id, file);
      onSaved();
    } catch (error) {
      setErr(error);
    } finally {
      setBusy(false);
    }
  };

  const previewSrc = filePreview || edit.imageUrl || '';
  return (
    <>
      <div role="dialog" aria-modal="true" aria-label={initial.id ? `Edit ${config.singular}` : `Add ${config.singular}`} className="fixed inset-0 z-50 flex items-stretch justify-center overflow-hidden bg-black/50 sm:items-center sm:p-4">
        <form onSubmit={save} className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
            <h2 className="text-xl font-semibold sm:text-2xl">{initial.id ? `Edit ${config.singular}` : `Add ${config.singular}`}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-mist-600 transition-colors hover:border-electric/40 hover:text-electric">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {config.fields.map((field) => {
                if (config.imageUpload && field.key === 'imageUrl') return null;
                return (
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
                );
              })}
            </div>
            {config.imageUpload && (
              <div className="rounded-xl border border-ink/10 p-4">
                <label htmlFor="f-imageUrl" className="mb-2 block text-sm font-medium">Application image</label>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => previewSrc && setViewImage(true)}
                    disabled={!previewSrc}
                    aria-label={previewSrc ? 'View application image' : 'No application image yet'}
                    className={`group relative grid h-28 w-40 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink/10 bg-mist ${previewSrc ? 'cursor-zoom-in' : 'cursor-default'}`}
                  >
                    {previewSrc ? (
                      <>
                        <img src={cloudinaryImage(previewSrc, 480, 360)} alt="Application preview" className="h-full w-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Click to view</span>
                      </>
                    ) : <span className="px-2 text-center text-xs text-mist-600">No image yet</span>}
                  </button>
                  <div className="min-w-0 flex-1 space-y-2">
                    <input id="f-imageUrl" className="field" placeholder="Cloudinary secure URL" value={edit.imageUrl ?? ''} onChange={(event) => set('imageUrl', event.target.value)} />
                    <div className="flex flex-wrap items-center gap-3">
                      <label htmlFor="record-image" className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-medium transition-colors hover:border-electric/40 hover:text-electric">Choose PNG/JPG</label>
                      <input id="record-image" type="file" accept=".png,.jpg,.jpeg" className="sr-only" style={{ position: 'fixed', top: 0, left: 0 }} onChange={(event) => setFile(event.target.files?.[0] || null)} />
                      <span className="min-w-0 truncate text-sm text-mist-600">{file ? file.name : 'or upload a new image'}</span>
                      {previewSrc && <button type="button" onClick={() => setViewImage(true)} className="text-sm font-medium text-electric hover:underline">View image</button>}
                    </div>
                    {file && <p className="text-xs text-mist-600">Uploads when you save.</p>}
                  </div>
                </div>
              </div>
            )}
            {err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{err.message}{err.details && Object.entries(err.details).map(([key, message]) => ` ${key}: ${message}`)}</p>}
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-ink/10 bg-white px-5 py-4 sm:px-6">
            <Button type="button" variant="outlineDark" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save'}</Button>
          </div>
        </form>
      </div>
      {viewImage && <ImageLightbox src={previewSrc} alt={edit.name ? `${edit.name} image` : `${config.singular} image`} onClose={() => setViewImage(false)} />}
    </>
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
