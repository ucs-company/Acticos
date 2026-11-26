import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import { Loading, ErrorState } from '@/components/States';
import GsapRevealGrid from '@/animations/GsapRevealGrid';
import Reveal from '@/animations/Reveal';
import Seo from '@/components/Seo';
import Button from '@/components/Button';
import ApplicationCard from '@/components/ApplicationCard';

export default function Applications() {
  const { data, loading, error, reload } = useAsync(() => catalogue.applications(), []);
  return (
    <>
      <Seo title="Applications" description="Find Acticos ingredients by personal care application." path="/applications" />
      <PageHero title="Applications" text="Start from the product format you are developing and see the ingredients that fit." crumbs={[{ label: 'Home', to: '/' }, { label: 'Applications' }]} />
      <div className="container-page py-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Find by format</p>
          <h2 className="h-section mt-3 max-w-2xl">Ingredients for the products you are creating</h2>
          <p className="lead mt-4">Explore the Acticos portfolio by application, then open a format to see matching ingredients.</p>
        </Reveal>
        <div className="mt-12">
          {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={reload} /> : (
            <GsapRevealGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" count={data?.length || 0}>
              {data.map((application) => <ApplicationCard key={application.slug} application={application} />)}
            </GsapRevealGrid>
          )}
        </div>
        <Reveal><div className="mt-12 flex flex-wrap gap-3"><Button to="/products">Explore Ingredients</Button><Button to="/find-ingredient" variant="outlineDark">Find my ingredient</Button></div></Reveal>
      </div>
    </>
  );
}
