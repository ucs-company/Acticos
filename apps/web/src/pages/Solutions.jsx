import { Link } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import { Loading, ErrorState } from '@/components/States';
import { Stagger, StaggerItem } from '@/animations/Stagger';
import Reveal from '@/animations/Reveal';
import Seo from '@/components/Seo';

export default function Solutions() {
  const { data, loading, error, reload } = useAsync(() => catalogue.solutions(), []);
  return (
    <>
      <Seo title="Solutions" description="Formulation solutions supported by the Acticos portfolio." path="/solutions" />
      <PageHero title="Formulation solutions" text="Browse by the formulation goal. Each solution lists the Acticos ingredients mapped to it." crumbs={[{ label: 'Home', to: '/' }, { label: 'Solutions' }]} />
      <div className="container-page py-16">
        <Reveal><p className="mb-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">[DATA REQUIRED] Solution-to-product mapping is placeholder data until it is confirmed against Acticos product information.</p></Reveal>
        {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={reload} /> : (
          <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {data.map((s) => (
              <StaggerItem as="li" key={s.slug}>
                <Link to={`/products?fn=${s.slug}`} className="block h-full rounded-2xl border border-ink/10 p-7 transition hover:-translate-y-1 hover:border-electric/50 hover:shadow-lift">
                  <h2 className="text-2xl font-semibold">{s.name}</h2>
                  <p className="mt-2 text-[15px] text-mist-600">{s._count?.products ?? 0} matching products</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </>
  );
}
