import { Link } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import { isMissing } from '@/utils/format';
import PageHero from '@/components/PageHero';
import SceneCanvas from '@/animations/SceneCanvas';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/animations/Reveal';
import Button from '@/components/Button';
import { ErrorState } from '@/components/States';
import Seo from '@/components/Seo';
import { SITE } from '@/config/site';

const Placeholder = ({ children = '[DATA REQUIRED]' }) => <span className="rounded bg-amber-100 px-2 py-0.5 text-sm text-amber-900">{children}</span>;

export default function ProductDetail({ slug }) {
  const { data: p, loading, error, reload } = useAsync(() => catalogue.product(slug), [slug]);

  if (loading) return <PageHero title="Loading product" crumbs={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }]} />;
  if (error) {
    return (
      <>
        <PageHero title={error.status === 404 ? 'Product not found' : 'Could not load product'} crumbs={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }]} />
        <div className="container-page py-16">
          {error.status === 404 ? <Button to="/products">Browse all products</Button> : <ErrorState error={error} onRetry={reload} />}
        </div>
      </>
    );
  }

  const q = `?product=${encodeURIComponent(p.name)}`;
  const tech = p.technicalInfo && Object.keys(p.technicalInfo).length ? Object.entries(p.technicalInfo) : null;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, category: p.category.name, brand: { '@type': 'Brand', name: SITE.name }, description: isMissing(p.description) ? undefined : p.description };

  return (
    <>
      <Seo title={p.seoTitle || p.name} description={p.seoDescription || `${p.name} (INCI: ${p.inci}) from Acticos.`} path={`/products/${p.slug}`} jsonLd={jsonLd} />
      <section className="relative overflow-hidden bg-navy-900 pt-32 text-white md:pt-40">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-10 pb-16 md:pb-24 lg:grid-cols-2">
          <Reveal>
            <nav aria-label="Breadcrumb" className="text-sm text-white/60">
              <ol className="flex flex-wrap gap-2">
                <li><Link to="/products" className="hover:underline">Products</Link></li><li aria-hidden="true">/</li>
                <li><Link to={`/products/${p.category.slug}`} className="hover:underline">{p.category.name}</Link></li><li aria-hidden="true">/</li>
                <li aria-current="page" className="text-white">{p.name}</li>
              </ol>
            </nav>
            <p className="mt-6 text-cyan">{p.category.name}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">{p.name}</h1>
            <p className="mt-5 text-sm text-white/60">INCI</p>
            <p className={`text-xl ${isMissing(p.inci) ? 'text-amber-300' : ''}`}>{p.inci}</p>
            {p.isSample && <p className="mt-4 inline-block rounded-full bg-amber-300/15 px-3 py-1 text-sm text-amber-200">Sample data. Replace with the Acticos record.</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={`/request-sample${q}`} size="lg">Request a Sample</Button>
              <Button to={`/request-quote${q}`} variant="outline" size="lg">Request a Quote</Button>
              <Button to={`/technical-enquiry${q}`} variant="outline" size="lg">Technical Enquiry</Button>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-navy-800">
            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy" /> : <SceneCanvas scene={p.category.visual} label={`${p.category.name} concept animation`} />}
          </Reveal>
        </div>
      </section>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[2fr_1fr] lg:py-24">
        <div className="space-y-14">
          <Reveal as="section" aria-labelledby="ov"><h2 id="ov" className="text-2xl font-semibold">Product overview</h2>
            <p className="mt-4 max-w-[65ch] leading-relaxed text-mist-600">{isMissing(p.description) ? <Placeholder>[DATA REQUIRED: product description]</Placeholder> : p.description}</p></Reveal>
          <Reveal as="section" aria-labelledby="ap"><h2 id="ap" className="text-2xl font-semibold">Applications</h2>
            <ul className="mt-4 flex flex-wrap gap-2">{p.applications.length ? p.applications.map((a) => <li key={a.slug}><Link to={`/applications/${a.slug}`} className="inline-block rounded-full border border-ink/15 px-4 py-2 transition hover:border-electric hover:text-electric">{a.name}</Link></li>) : <li><Placeholder /></li>}</ul></Reveal>
          <Reveal as="section" aria-labelledby="kf"><h2 id="kf" className="text-2xl font-semibold">Key features</h2>
            {p.benefits?.length ? <ul className="mt-4 list-disc space-y-2 pl-5">{p.benefits.map((b) => <li key={b}>{b}</li>)}</ul> : <p className="mt-4"><Placeholder>[DATA REQUIRED: key features]</Placeholder></p>}</Reveal>
          <Reveal as="section" aria-labelledby="ti"><h2 id="ti" className="text-2xl font-semibold">Technical information</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
              <table className="w-full text-left text-[15px]"><tbody className="divide-y divide-ink/10">
                {(tech || [['Appearance', null], ['CAS number', null], ['Recommended usage level', null], ['Packaging', null]]).map(([k, v]) => (
                  <tr key={k}><th scope="row" className="w-1/3 bg-mist px-5 py-3 font-medium">{k}</th><td className="px-5 py-3">{v ?? <Placeholder />}</td></tr>
                ))}
              </tbody></table>
            </div></Reveal>
          <Reveal as="section" aria-labelledby="dc"><h2 id="dc" className="text-2xl font-semibold">Documents</h2>
            {p.documents?.length ? <ul className="mt-4 space-y-2">{p.documents.map((d) => <li key={d.id}><a className="text-electric hover:underline" href={d.fileUrl}>{d.title} ({d.type})</a></li>)}</ul>
              : <p className="mt-4 text-mist-600">TDS and SDS will be listed here once uploaded. <Placeholder>[DATA REQUIRED]</Placeholder></p>}</Reveal>
        </div>
        <Reveal as="aside" className="h-fit rounded-3xl bg-mist p-7 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold">Need this for a formulation?</h2>
          <p className="mt-2 text-[15px] text-mist-600">Tell us what you are developing and we will respond with the right next step.</p>
          <div className="mt-5 grid gap-3"><Button to={`/request-quote${q}`}>Request a Quote</Button><Button variant="outlineDark" to={`/request-sample${q}`}>Request a Sample</Button></div>
        </Reveal>
      </div>

      {p.related?.length > 0 && (
        <section className="bg-mist py-16 md:py-20"><div className="container-page">
          <Reveal><h2 className="text-3xl font-semibold">Related products</h2></Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{p.related.map((r, i) => <ProductCard key={r.slug} product={r} index={i} />)}</div>
        </div></section>
      )}
    </>
  );
}
