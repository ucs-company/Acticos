import { useParams } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import ProductCard from '@/components/ProductCard';
import ApplicationVisual from '@/components/ApplicationVisual';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import Reveal from '@/animations/Reveal';
import GsapImageParallax from '@/animations/GsapImageParallax';
import Seo from '@/components/Seo';
import Button from '@/components/Button';

export default function ApplicationDetail() {
  const { slug } = useParams();
  const details = useAsync(() => catalogue.application(slug), [slug]);
  const products = useAsync(() => catalogue.products({ application: slug, pageSize: 60 }), [slug]);
  const app = details.data;

  if (details.loading) {
    return <div className="container-page py-20"><Loading /></div>;
  }

  if (details.error || !app) {
    return (
      <PageHero title="Application not found" crumbs={[{ label: 'Home', to: '/' }, { label: 'Applications', to: '/applications' }]}>
        <Button to="/applications">All applications</Button>
      </PageHero>
    );
  }

  return (
    <>
      <Seo title={`${app.name} ingredients`} path={`/applications/${slug}`} description={`Acticos ingredients for ${app.name.toLowerCase()} formulations.`} />
      <PageHero title={app.name} text={app.description || undefined} crumbs={[{ label: 'Home', to: '/' }, { label: 'Applications', to: '/applications' }, { label: app.name }]} visual={<ApplicationVisual application={app} className="h-full w-full opacity-90" priority />} />
      <div className="container-page py-16">
        <div className="mb-12 md:hidden">
          <GsapImageParallax className="aspect-[16/10] rounded-3xl">
            <ApplicationVisual application={app} className="h-full w-full" priority />
          </GsapImageParallax>
        </div>
        <Reveal><h2 className="text-3xl font-semibold">Relevant ingredients</h2></Reveal>
        <div className="mt-8">
          {products.loading ? <Loading /> : products.error ? <ErrorState error={products.error} onRetry={products.reload} /> : !products.data?.length ? <EmptyState title="No products listed yet" text="Products for this application will appear here." /> : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.data.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div>
          )}
        </div>
        <Reveal><Button to="/products" className="mt-12">Explore Ingredients</Button></Reveal>
      </div>
    </>
  );
}
