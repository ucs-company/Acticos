import PageHero from '@/components/PageHero';
import Button from '@/components/Button';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (<><Seo title="Page not found" noindex /><PageHero title="Page not found" text="The page you are looking for has moved or does not exist."><Button to="/">Back to home</Button><Button to="/products" variant="outline">Browse products</Button></PageHero></>);
}
