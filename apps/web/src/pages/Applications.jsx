import { Link } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import { Loading, ErrorState } from '@/components/States';
import { Stagger, StaggerItem } from '@/animations/Stagger';
import Reveal from '@/animations/Reveal';
import Seo from '@/components/Seo';
import Button from '@/components/Button';

export default function Applications() {
  const { data, loading, error, reload } = useAsync(() => catalogue.applications(), []);
  return (
    <>
      <Seo title="Applications" description="Find Acticos ingredients by personal care application." path="/applications" />
      <PageHero title="Applications" text="Start from the product format you are developing and see the ingredients that fit." crumbs={[{ label: 'Home', to: '/' }, { label: 'Applications' }]} />
      <div className="container-page py-16">
        {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={reload} /> : (
          <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {data.map((a) => (
              <StaggerItem as="li" key={a.slug}>
                <Link to={`/applications/${a.slug}`} className="block h-full rounded-2xl border border-ink/10 p-7 transition hover:-translate-y-1 hover:border-electric/50 hover:shadow-lift">
                  <h2 className="text-2xl font-semibold">{a.name}</h2>
                  <p className="mt-2 text-[15px] text-mist-600">{a._count?.products ?? 0} products</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
        <Reveal><Button to="/products" className="mt-12">Explore Ingredients</Button></Reveal>
      </div>
    </>
  );
}
