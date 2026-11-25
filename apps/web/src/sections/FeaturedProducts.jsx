import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import ProductCard from '@/components/ProductCard';
import { EmptyState, Loading } from '@/components/States';
import Button from '@/components/Button';
import Reveal from '@/animations/Reveal';

const pickFeatured = (products) => {
  const seen = new Set();
  return (products || []).filter((product) => {
    const slug = product.category?.slug;
    if (!slug || seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
};

export default function FeaturedProducts() {
  const { data: products, loading, error } = useAsync(() => catalogue.products({ pageSize: 60 }), []);
  const featured = pickFeatured(products);
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><h2 className="h-section">Featured products</h2></Reveal>
          <Button to="/products" variant="outlineDark">View All Products</Button>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? <div className="sm:col-span-2 xl:col-span-4"><Loading /></div>
            : error || !featured.length ? <div className="sm:col-span-2 xl:col-span-4"><EmptyState title="Products unavailable" text="Please try again shortly." /></div>
              : featured.map((product, i) => <ProductCard key={product.slug} product={product} index={i} />)}
        </div>
      </div>
    </section>
  );
}
