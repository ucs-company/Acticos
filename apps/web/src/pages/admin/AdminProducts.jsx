import { useEffect, useState } from 'react';
import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import ImageLightbox from '@/components/ImageLightbox';
import Button from '@/components/Button';
import { cloudinaryImage } from '@/utils/images';

const blank = {
  name: '', slug: '', code: '', inci: '', categoryId: '', description: '', benefits: [], functions: [],
  applicationIds: [], solutionIds: [], seoTitle: '', seoDescription: '', imageUrl: '', status: 'DRAFT',
  isSample: false, technicalInfo: null,
};

function ProductForm({ initial, categories, applications, solutions, onClose, onSaved }) {
  const [v, setV] = useState({ ...blank, ...initial });
  const [techText, setTechText] = useState(initial.technicalInfo ? JSON.stringify(initial.technicalInfo, null, 2) : '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [viewImage, setViewImage] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    if (!imageFile) { setImagePreview(''); return undefined; }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);
  const set = (key, value) => setV((current) => ({ ...current, [key]: value }));
  const toggle = (key, id) => set(key, v[key].includes(id) ? v[key].filter((item) => item !== id) : [...v[key], id]);
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      let technicalInfo = null;
      if (techText.trim()) {
        try { technicalInfo = JSON.parse(techText); } catch { throw new Error('Technical info must be valid JSON'); }
      }
      const payload = {
        ...v,
        slug: v.slug || undefined,
        id: undefined,
        category: undefined,
        applications: undefined,
        solutions: undefined,
        documents: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        technicalInfo,
      };
      const result = await admin.saveProduct(initial.id, payload);
      if (imageFile) await admin.uploadProductImage(result.data.id, imageFile);
      onSaved();
    } catch (error) {
      setErr(error);
    } finally {
      setBusy(false);
    }
  };
  const L = ({ id, children }) => <label htmlFor={id} className="mb-1 block text-sm font-medium">{children}</label>;
  const previewSrc = imagePreview || v.imageUrl || '';
  return (
    <>
      <div role="dialog" aria-modal="true" aria-label={initial.id ? 'Edit product' : 'Add product'} className="fixed inset-0 z-50 flex items-stretch justify-center overflow-hidden bg-black/50 sm:items-center sm:p-4">
        <form onSubmit={save} className="flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
            <h2 className="text-xl font-semibold sm:text-2xl">{initial.id ? 'Edit product' : 'Add product'}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-mist-600 transition-colors hover:border-electric/40 hover:text-electric">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><L id="n">Product name</L><input id="n" required className="field" value={v.name || ''} onChange={(event) => set('name', event.target.value)} /></div>
              <div><L id="c">Product code</L><input id="c" className="field" value={v.code || ''} onChange={(event) => set('code', event.target.value)} /></div>
              <div><L id="s">Slug</L><input id="s" className="field" placeholder="Auto from name" value={v.slug || ''} onChange={(event) => set('slug', event.target.value)} /></div>
              <div><L id="i">INCI</L><input id="i" required className="field" value={v.inci || ''} onChange={(event) => set('inci', event.target.value)} /></div>
              <div><L id="cat">Category</L><select id="cat" required className="field" value={v.categoryId || ''} onChange={(event) => set('categoryId', event.target.value)}><option value="">Select</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
              <div><L id="st">Status</L><select id="st" className="field" value={v.status || 'DRAFT'} onChange={(event) => set('status', event.target.value)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Applications</legend>
              <div className="flex flex-wrap gap-2">{applications.map((application) => (
                <label key={application.id} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${v.applicationIds.includes(application.id) ? 'border-electric bg-electric/10' : 'border-ink/15'}`}>
                  <input type="checkbox" className="sr-only" checked={v.applicationIds.includes(application.id)} onChange={() => toggle('applicationIds', application.id)} />{application.name}
                </label>))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Solutions</legend>
              <div className="flex flex-wrap gap-2">{solutions.map((solution) => (
                <label key={solution.id} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${v.solutionIds.includes(solution.id) ? 'border-electric bg-electric/10' : 'border-ink/15'}`}>
                  <input type="checkbox" className="sr-only" checked={v.solutionIds.includes(solution.id)} onChange={() => toggle('solutionIds', solution.id)} />{solution.name}
                </label>))}
              </div>
            </fieldset>
            <div><L id="d">Description</L><textarea id="d" rows={4} className="field" value={v.description || ''} onChange={(event) => set('description', event.target.value)} /></div>
            <div><L id="b">Benefits (one per line)</L><textarea id="b" rows={3} className="field" value={(v.benefits || []).join('\n')} onChange={(event) => set('benefits', event.target.value.split('\n').filter(Boolean))} /></div>
            <div><L id="t">Technical info (JSON)</L><textarea id="t" rows={5} className="field font-mono text-sm" placeholder='{"Appearance":"Clear liquid","Recommended Usage":"0.5–1%"}' value={techText} onChange={(event) => setTechText(event.target.value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><L id="s1">SEO title</L><input id="s1" className="field" value={v.seoTitle || ''} onChange={(event) => set('seoTitle', event.target.value)} /></div>
              <div><L id="s2">SEO description</L><input id="s2" className="field" value={v.seoDescription || ''} onChange={(event) => set('seoDescription', event.target.value)} /></div>
            </div>
            <div className="rounded-xl border border-ink/10 p-4">
              <L id="img-url">Product image</L>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => previewSrc && setViewImage(true)}
                  disabled={!previewSrc}
                  aria-label={previewSrc ? 'View product image' : 'No product image yet'}
                  className={`group relative grid h-28 w-40 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink/10 bg-mist ${previewSrc ? 'cursor-zoom-in' : 'cursor-default'}`}
                >
                  {previewSrc ? (
                    <>
                      <img src={cloudinaryImage(previewSrc, 480, 360)} alt="Product preview" className="h-full w-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Click to view</span>
                    </>
                  ) : <span className="px-2 text-center text-xs text-mist-600">No image yet</span>}
                </button>
                <div className="min-w-0 flex-1 space-y-2">
                  <input id="img-url" className="field" placeholder="Cloudinary URL or /images/products/example.webp" value={v.imageUrl || ''} onChange={(event) => set('imageUrl', event.target.value)} />
                  <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="img-file" className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-medium transition-colors hover:border-electric/40 hover:text-electric">Choose PNG/JPG</label>
                    <input id="img-file" type="file" accept=".png,.jpg,.jpeg" className="sr-only" style={{ position: 'fixed', top: 0, left: 0 }} onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                    <span className="min-w-0 truncate text-sm text-mist-600">{imageFile ? imageFile.name : 'or upload a new image'}</span>
                    {previewSrc && <button type="button" onClick={() => setViewImage(true)} className="text-sm font-medium text-electric hover:underline">View image</button>}
                  </div>
                  {imageFile && <p className="text-xs text-mist-600">Uploads when you save.</p>}
                </div>
              </div>
            </div>
            {err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{err.message}{err.details && Object.entries(err.details).map(([key, message]) => ` ${key}: ${message}`)}</p>}
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-ink/10 bg-white px-5 py-4 sm:px-6">
            <Button type="button" variant="outlineDark" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save product'}</Button>
          </div>
        </form>
      </div>
      {viewImage && <ImageLightbox src={previewSrc} alt={v.name ? `${v.name} image` : 'Product image'} onClose={() => setViewImage(false)} />}
    </>
  );
}

export default function AdminProducts() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [application, setApplication] = useState('');
  const [status, setStatus] = useState('');
  const [edit, setEdit] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const list = useAsync(() => admin.products({ q, category, application, status, pageSize: 60 }), [q, category, application, status]);
  const refs = useAsync(async () => {
    const [categories, applications, solutions] = await Promise.all([admin.list('categories'), admin.list('applications'), admin.list('solutions')]);
    return { categories, applications, solutions };
  }, []);
  const canDelete = user.role !== 'EDITOR';
  const act = async (fn) => {
    try { await fn(); list.reload(); } catch (error) { alert(error.message); }
  };
  const open = async (id) => {
    try {
      const product = id ? await admin.product(id) : blank;
      setEdit({
        ...blank,
        ...product,
        applicationIds: product.applications?.map((application) => application.id) || [],
        solutionIds: product.solutions?.map((solution) => solution.id) || [],
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">Products</h1><Button onClick={() => open(null)}>Add product</Button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="sr-only" htmlFor="aq">Search products</label>
          <input id="aq" type="search" className="field" placeholder="Search products" value={q} onChange={(event) => setQ(event.target.value)} />
        </div>
        <select aria-label="Filter by category" className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {(refs.data?.categories || []).map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
        </select>
        <select aria-label="Filter by application" className="field" value={application} onChange={(event) => setApplication(event.target.value)}>
          <option value="">All applications</option>
          {(refs.data?.applications || []).map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
        </select>
        <select aria-label="Filter by status" className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>
      {(q || category || application || status) && (
        <button type="button" onClick={() => { setQ(''); setCategory(''); setApplication(''); setStatus(''); }} className="mt-3 text-sm font-medium text-electric hover:underline">Clear filters</button>
      )}
      <div className="mt-5">
        {list.loading ? <Loading /> : list.error ? <ErrorState error={list.error} onRetry={list.reload} /> : !list.data?.length ? <EmptyState title="No products yet" text="Add a product or run the import script." /> : (
          <>
            <div className="hidden overflow-x-auto rounded-2xl bg-white md:block"><table className="w-full text-left text-[15px]"><thead className="border-b border-ink/10 text-sm text-mist-600"><tr><th className="p-4">Name</th><th className="p-4">INCI</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-ink/10">{list.data.map((product) => (
                <tr key={product.id}><td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <button type="button" onClick={() => setViewImage({ src: product.imageUrl, alt: product.name })} aria-label={`View image for ${product.name}`} className="h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-mist">
                        <img src={cloudinaryImage(product.imageUrl, 160, 120)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </button>
                    ) : (
                      <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg border border-dashed border-ink/15 text-[10px] text-mist-600">No image</span>
                    )}
                    <span className="min-w-0">{product.name}</span>
                  </div>
                </td><td className="p-4">{product.inci}</td><td className="p-4">{product.category.name}</td>
                  <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs ${product.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-900' : 'bg-mist text-mist-600'}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span></td>
                  <td className="space-x-3 whitespace-nowrap p-4 text-right text-sm font-medium text-electric">
                    <button onClick={() => open(product.id)}>Edit</button>
                    <button onClick={() => act(() => admin.setStatus(product.id, product.status !== 'PUBLISHED'))}>{product.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                    {canDelete && <button className="text-red-600" onClick={() => confirm(`Delete ${product.name}?`) && act(() => admin.deleteProduct(product.id))}>Delete</button>}
                  </td></tr>))}</tbody></table></div>
            <div className="space-y-3 md:hidden">{list.data.map((product) => (
              <article key={product.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    {product.imageUrl ? (
                      <button type="button" onClick={() => setViewImage({ src: product.imageUrl, alt: product.name })} aria-label={`View image for ${product.name}`} className="h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-mist">
                        <img src={cloudinaryImage(product.imageUrl, 200, 150)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </button>
                    ) : (
                      <span className="grid h-14 w-16 shrink-0 place-items-center rounded-lg border border-dashed border-ink/15 text-center text-[10px] text-mist-600">No image</span>
                    )}
                    <div className="min-w-0"><h2 className="truncate font-semibold">{product.name}</h2><p className="mt-1 text-sm text-mist-600">{product.category.name}</p></div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${product.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-900' : 'bg-mist text-mist-600'}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-mist-600">{product.inci}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-electric">
                  <button onClick={() => open(product.id)}>Edit</button>
                  {product.imageUrl && <button onClick={() => setViewImage({ src: product.imageUrl, alt: product.name })}>View image</button>}
                  <button onClick={() => act(() => admin.setStatus(product.id, product.status !== 'PUBLISHED'))}>{product.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                  {canDelete && <button className="text-red-600" onClick={() => confirm(`Delete ${product.name}?`) && act(() => admin.deleteProduct(product.id))}>Delete</button>}
                </div>
              </article>))}</div>
          </>
        )}
      </div>
      {edit && refs.data && <ProductForm initial={edit} categories={refs.data.categories} applications={refs.data.applications} solutions={refs.data.solutions} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
      {viewImage && <ImageLightbox src={viewImage.src} alt={`${viewImage.alt} image`} onClose={() => setViewImage(null)} />}
    </div>
  );
}
