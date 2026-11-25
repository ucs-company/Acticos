import PageHero from '@/components/PageHero';
import EnquiryForm from '@/components/EnquiryForm';
import Button from '@/components/Button';
import Reveal from '@/animations/Reveal';
import { Stagger, StaggerItem } from '@/animations/Stagger';
import Seo from '@/components/Seo';
import { contactFields } from '@/config/forms';
import { SITE } from '@/config/site';

export default function Contact() {
  return (
    <>
      <Seo title="Contact Acticos" description="Contact the Acticos team." path="/contact" />
      <PageHero title="Contact Acticos" text="Talk to our team about ingredients, samples or formulation support." crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.4fr_1fr]">
        <Reveal><EnquiryForm fields={contactFields} endpoint="/contact" submitLabel="Send Enquiry" /></Reveal>
        <Stagger as="aside" className="space-y-8" stagger={0.12}>
          <StaggerItem>
            <h2 className="text-xl font-semibold">{SITE.legalName}</h2>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div><dt className="text-mist-600">Email</dt><dd>{SITE.contact.email}</dd></div>
              <div><dt className="text-mist-600">Phone</dt><dd>{SITE.contact.phone}</dd></div>
              <div><dt className="text-mist-600">Address</dt><dd>{SITE.contact.address}</dd></div>
            </dl>
          </StaggerItem>
          <StaggerItem className="grid gap-3"><Button to="/request-quote">Request Quote</Button><Button to="/request-sample" variant="outlineDark">Request Sample</Button><Button to="/technical-enquiry" variant="outlineDark">Technical Enquiry</Button></StaggerItem>
        </Stagger>
      </div>
    </>
  );
}
