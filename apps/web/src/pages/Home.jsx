import Seo from '@/components/Seo';
import Hero from '@/sections/Hero';
import TrustStrip from '@/sections/TrustStrip';
import PortfolioSection from '@/sections/PortfolioSection';
import ApplicationsSection from '@/sections/ApplicationsSection';
import WhySection from '@/sections/WhySection';
import FeaturedProducts from '@/sections/FeaturedProducts';
import TechnicalSupport from '@/sections/TechnicalSupport';
import ResourcesSection from '@/sections/ResourcesSection';
import FinalCta from '@/sections/FinalCta';
import { SITE } from '@/config/site';

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: SITE.legalName, url: SITE.url }} />
      <Hero /><TrustStrip /><PortfolioSection /><ApplicationsSection /><WhySection />
      <FeaturedProducts /><TechnicalSupport /><ResourcesSection /><FinalCta />
    </>
  );
}
