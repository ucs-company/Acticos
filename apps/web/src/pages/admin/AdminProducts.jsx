import { useState } from 'react';
import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import Button from '@/components/Button';

const blank = {
  name: '', slug: '', code: '', inci: '', categoryId: '', description: '', benefits: [], functions: [],
  applicationIds: [], solutionIds: [], seoTitle: '', seoDescription: '', imageUrl: '', status: 'DRAFT',
  isSample: false, technicalInfo: null,
};

function ProductForm({ initial, categories, applications, solutions, onClose, onSaved }) {
  const [v, setV] = useState({ ...blank, ...initial });
  const [techText, setTechText] = useState(initial.technicalInfo ? JSON.stringify(initial.technicalInfo, null, 2) : '');
  const [imageFile, setImageFile] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
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
  return (
    <div role="dialog" aria-modal="true" aria-label={initial.id ? 'Edit product' : 'Add product'} className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-black/50 p-4">
      <form onSubmit={save} className="mx-auto my-8 w-full max-w-3xl space-y-4 rounded-2xl bg-white p-6">
        <h2 className="text-2xl font-semibold">{initial.id ? 'Edit product' : 'Add product'}</h2>
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
          <L id="img">Product image (PNG/JPG)</L>
          {v.imageUrl && <p className="mb-2 text-sm text-mist-600">Current: <a className="text-electric hover:underline" href={v.imageUrl} target="_blank" rel="noreferrer">View image</a></p>}
          <input id="img" type="file" accept=".png,.jpg,.jpeg" className="field" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        </div>
        {err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{err.message}{err.details && Object.entries(err.details).map(([key, message]) => ` ${key}: ${message}`)}</p>}
        <div className="flex justify-end gap-3"><Button type="button" variant="outlineDark" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save product'}</Button></div>
      </form>
    </div>
  );
}

export default function AdminProducts() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const list = useAsync(() => admin.products({ q, pageSize: 60 }), [q]);
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
      <label className="sr-only" htmlFor="aq">Search products</label>
      <input id="aq" type="search" className="field mt-5 max-w-md" placeholder="Search products" value={q} onChange={(event) => setQ(event.target.value)} />
      <div className="mt-5">
        {list.loading ? <Loading /> : list.error ? <ErrorState error={list.error} onRetry={list.reload} /> : !list.data?.length ? <EmptyState title="No products yet" text="Add a product or run the import script." /> : (
          <>
            <div className="hidden overflow-x-auto rounded-2xl bg-white md:block"><table className="w-full text-left text-[15px]"><thead className="border-b border-ink/10 text-sm text-mist-600"><tr><th className="p-4">Name</th><th className="p-4">INCI</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-ink/10">{list.data.map((product) => (
                <tr key={product.id}><td className="p-4 font-medium">{product.name}</td><td className="p-4">{product.inci}</td><td className="p-4">{product.category.name}</td>
                  <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs ${product.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-900' : 'bg-mist text-mist-600'}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span></td>
                  <td className="space-x-3 whitespace-nowrap p-4 text-right text-sm font-medium text-electric">
                    <button onClick={() => open(product.id)}>Edit</button>
                    <button onClick={() => act(() => admin.setStatus(product.id, product.status !== 'PUBLISHED'))}>{product.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                    {canDelete && <button className="text-red-600" onClick={() => confirm(`Delete ${product.name}?`) && act(() => admin.deleteProduct(product.id))}>Delete</button>}
                  </td></tr>))}</tbody></table></div>
            <div className="space-y-3 md:hidden">{list.data.map((product) => (
              <article key={product.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><h2 className="truncate font-semibold">{product.name}</h2><p className="mt-1 text-sm text-mist-600">{product.category.name}</p></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${product.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-900' : 'bg-mist text-mist-600'}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-mist-600">{product.inci}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-electric">
                  <button onClick={() => open(product.id)}>Edit</button>
                  <button onClick={() => act(() => admin.setStatus(product.id, product.status !== 'PUBLISHED'))}>{product.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                  {canDelete && <button className="text-red-600" onClick={() => confirm(`Delete ${product.name}?`) && act(() => admin.deleteProduct(product.id))}>Delete</button>}
                </div>
              </article>))}</div>
          </>
        )}
      </div>
      {edit && refs.data && <ProductForm initial={edit} categories={refs.data.categories} applications={refs.data.applications} solutions={refs.data.solutions} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
    </div>
  );
}
