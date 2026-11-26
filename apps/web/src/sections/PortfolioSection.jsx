import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import CategoryCard from '@/components/CategoryCard';
import { EmptyState, Loading } from '@/components/States';
import Reveal from '@/animations/Reveal';

export default function PortfolioSection() {
  const { data: categories, loading, error } = useAsync(() => catalogue.categories(), []);
  return (
    <section className="section bg-mist">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Product portfolio</p>
          <h2 className="h-section mt-3 max-w-2xl">Ingredient families</h2>
          <p className="lead mt-4">Explore specialty ingredients designed for high-performance personal care formulations.</p>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {loading ? <div className="md:col-span-2 xl:col-span-4"><Loading /></div>
            : error || !categories?.length ? <div className="md:col-span-2 xl:col-span-4"><EmptyState title="Categories unavailable" text="Please try again shortly." /></div>
              : categories.map((c, i) => <CategoryCard key={c.slug} category={c} index={i} />)}
        </div>
      </div>
    </section>
  );
}
