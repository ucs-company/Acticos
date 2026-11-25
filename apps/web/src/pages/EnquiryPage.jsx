import { useSearchParams } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import EnquiryForm from '@/components/EnquiryForm';
import Reveal from '@/animations/Reveal';
import Seo from '@/components/Seo';
import { quoteFields, sampleFields, technicalFields } from '@/config/forms';

const CONFIG = {
  quote: { title: 'Request a Quote', text: 'Tell us what you need and we will respond with pricing and availability.', endpoint: '/enquiries/quote', submit: 'Submit Request', fields: quoteFields, path: '/request-quote' },
  sample: { title: 'Request a Sample', text: 'Evaluate an ingredient in your own formulation.', endpoint: '/enquiries/sample', submit: 'Request Sample', fields: sampleFields, path: '/request-sample' },
  technical: { title: 'Technical Enquiry', text: 'Ask our technical team about an ingredient, application or formulation.', endpoint: '/enquiries/technical', submit: 'Submit Technical Enquiry', fields: technicalFields, path: '/technical-enquiry', multipart: true },
};

export default function EnquiryPage({ kind }) {
  const c = CONFIG[kind];
  const [params] = useSearchParams();
  const { data } = useAsync(async () => {
    const [{ data: products }, apps] = await Promise.all([catalogue.products({ pageSize: 60 }), catalogue.applications()]);
    return { products: products.map((p) => p.name), apps: apps.map((a) => a.name) };
  }, []);
  const fields = c.fields(data?.products || [], data?.apps || []);
  return (
    <>
      <Seo title={c.title} description={c.text} path={c.path} />
      <PageHero title={c.title} text={c.text} crumbs={[{ label: 'Home', to: '/' }, { label: c.title }]} />
      <div className="container-page max-w-3xl py-16">
        <Reveal key={params.get('product') || 'x'}><EnquiryForm fields={fields} endpoint={c.endpoint} submitLabel={c.submit} multipart={c.multipart} initial={{ product: params.get('product') || '' }} /></Reveal>
      </div>
    </>
  );
}
