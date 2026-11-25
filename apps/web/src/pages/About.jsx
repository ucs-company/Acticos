import PageHero from '@/components/PageHero';
import Seo from '@/components/Seo';
import SceneCanvas from '@/animations/SceneCanvas';
import Counter from '@/animations/Counter';
import Reveal from '@/animations/Reveal';
import { Stagger, StaggerItem } from '@/animations/Stagger';
import Button from '@/components/Button';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import { SITE } from '@/config/site';

const BLOCKS = [
  { t: 'Our approach', d: 'We supply ingredients and the technical context needed to use them well. [DATA REQUIRED: company approach statement]' },
  { t: 'Quality', d: '[DATA REQUIRED: quality systems, certifications and testing. Do not publish until confirmed.]' },
  { t: 'Technical expertise', d: '[DATA REQUIRED: team background and lab capabilities]' },
  { t: 'Innovation', d: '[DATA REQUIRED: R&D focus and proprietary blend development]' },
  { t: 'Customer partnership', d: '[DATA REQUIRED: how Acticos works with formulators and brands]' },
];

export default function About() {
  const { data: counts } = useAsync(async () => {
    const [categories, applications] = await Promise.all([catalogue.categories(), catalogue.applications()]);
    return { categories: categories.length, applications: applications.length };
  }, []);

  return (
    <>
      <Seo title="About Acticos" description={`${SITE.legalName}: specialty ingredients for personal care formulation.`} path="/about" />
      <PageHero title="About Acticos" text="A specialty-ingredient partner for personal care and cosmetic formulators." crumbs={[{ label: 'Home', to: '/' }, { label: 'About Acticos' }]} visual={<SceneCanvas scene="preservative" label="Particles forming a protective shell" />} />
      <section className="container-page py-20">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {[[counts?.categories || 0, 'product categories'], [counts?.applications || 0, 'application areas']].map(([n, label]) => (
              <div key={label} className="bg-white p-10"><Counter to={n} className="font-display text-6xl font-semibold text-electric" /><p className="mt-2 text-mist-600">{label}</p></div>
            ))}
          </div>
        </Reveal>
        <Stagger className="mt-16 grid gap-10 md:grid-cols-2" stagger={0.08}>
          {BLOCKS.map((block) => (
            <StaggerItem key={block.t}><h2 className="text-2xl font-semibold">{block.t}</h2><p className="mt-3 max-w-[60ch] leading-relaxed text-mist-600">{block.d}</p></StaggerItem>
          ))}
        </Stagger>
        <Reveal><Button to="/contact" className="mt-14" size="lg">Contact Acticos</Button></Reveal>
      </section>
    </>
  );
}
