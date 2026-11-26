import { useParams } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import { Loading } from '@/components/States';
import SceneCanvas from '@/animations/SceneCanvas';
import CatalogueView from '@/components/CatalogueView';
import Seo from '@/components/Seo';
import Button from '@/components/Button';
import ProductDetail from './ProductDetail';

export default function Products() {
  const { slug } = useParams();
  const filters = useAsync(async () => {
    const [categories, applications, solutions] = await Promise.all([
      catalogue.categories(), catalogue.applications(), catalogue.solutions(),
    ]);
    return { categories, applications, solutions };
  }, []);

  if (slug && filters.loading) {
    return <div className="container-page py-20"><Loading /></div>;
  }

  const data = filters.data || { categories: [], applications: [], solutions: [] };
  const category = slug ? data.categories.find((item) => item.slug === slug) : null;
  if (slug && !category) return <ProductDetail slug={slug} />;

  const desc = category?.description;
  const categoryCount = Number(category?._count?.products || 0);
  const totalProducts = data.categories.reduce((sum, item) => sum + Number(item._count?.products || 0), 0);
  const badge = category
    ? `${categoryCount} ingredient${categoryCount === 1 ? '' : 's'} in this category`
    : `${data.categories.length} categories · ${totalProducts} ingredients`;

  return (
    <>
      <Seo title={category ? category.name : 'Ingredient catalogue'} description={desc || 'Browse the Acticos specialty ingredient catalogue.'} path={category ? `/products/${category.slug}` : '/products'} />
      <PageHero
        title={category ? category.name : 'Ingredient catalogue'}
        text={category ? desc : 'Search the Acticos portfolio by ingredient name, INCI or application.'}
        badge={badge}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Products', to: category ? '/products' : undefined }, ...(category ? [{ label: category.name }] : [])]}
        visual={category ? <SceneCanvas scene={category.visual} label={`${category.name} visual`} /> : <SceneCanvas scene="active" label="Molecules moving through a formulation" />}
      >
        <Button to="/find-ingredient" variant="outline" size="lg">Find my ingredient</Button>
      </PageHero>
      <CatalogueView categorySlug={category?.slug || null} categories={data.categories} applications={data.applications} solutions={data.solutions} />
    </>
  );
}
