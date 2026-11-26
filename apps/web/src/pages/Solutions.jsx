import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import { Loading, ErrorState } from '@/components/States';
import Reveal from '@/animations/Reveal';
import GsapRevealGrid from '@/animations/GsapRevealGrid';
import Seo from '@/components/Seo';
import Button from '@/components/Button';
import SolutionCard from '@/components/SolutionCard';

export default function Solutions() {
  const { data, loading, error, reload } = useAsync(() => catalogue.solutions(), []);
  return (
    <>
      <Seo title="Formulation goals" description="Find Acticos ingredients by formulation goal." path="/solutions" />
      <PageHero title="Formulation goals" text="Start with the result your formulation needs to deliver, then explore the Acticos ingredients mapped to it." crumbs={[{ label: 'Home', to: '/' }, { label: 'Formulation goals' }]} />
      <div className="container-page py-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Formulation goals</p>
          <h2 className="h-section mt-3 max-w-2xl">What should your formulation deliver?</h2>
          <p className="lead mt-4">Preservation, hydration, brightening, anti-aging and sensory performance — each goal maps to a focused set of ingredients.</p>
        </Reveal>
        <div className="mt-12">
          {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={reload} /> : (
            <GsapRevealGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" count={data?.length || 0}>
              {data.map((solution) => <SolutionCard key={solution.slug} solution={solution} />)}
            </GsapRevealGrid>
          )}
        </div>
        <Reveal>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button to="/find-ingredient">Find your ingredient</Button>
            <Button to="/products" variant="outlineDark">Browse all ingredients</Button>
          </div>
        </Reveal>
      </div>
    </>
  );
}
