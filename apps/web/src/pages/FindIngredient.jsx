import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import ApplicationVisual from '@/components/ApplicationVisual';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import Seo from '@/components/Seo';
import { Loading, ErrorState, EmptyState } from '@/components/States';
import GsapRevealGrid from '@/animations/GsapRevealGrid';

const STEPS = ['Application', 'Formulation goal', 'Matches'];

export default function FindIngredient() {
  const [step, setStep] = useState(0);
  const [application, setApplication] = useState('');
  const [fn, setFn] = useState('');
  const applications = useAsync(() => catalogue.applications(), []);
  const solutions = useAsync(() => catalogue.solutions(), []);
  const products = useAsync(() => (application ? catalogue.products({ application, fn: fn || undefined, pageSize: 60 }) : Promise.resolve({ data: [], meta: { total: 0 } })), [application, fn]);

  const selectedApplication = applications.data?.find((item) => item.slug === application);
  const selectedSolution = solutions.data?.find((item) => item.slug === fn);

  const chooseApplication = (slug) => {
    setApplication(slug);
    setFn('');
    setStep(1);
  };

  const chooseSolution = (slug) => {
    setFn(slug);
    setStep(2);
  };

  const reset = () => {
    setApplication('');
    setFn('');
    setStep(0);
  };

  return (
    <>
      <Seo title="Find your ingredient" description="Find Acticos ingredients by application and formulation goal." path="/find-ingredient" />
      <PageHero title="Find your ingredient" text="Tell us what you are developing and we will narrow the Acticos portfolio to the right ingredients." crumbs={[{ label: 'Home', to: '/' }, { label: 'Find your ingredient' }]} />

      <div className="container-page py-14 md:py-20">
        <ol className="flex flex-wrap items-center gap-2 text-sm" aria-label="Ingredient finder steps">
          {STEPS.map((label, index) => {
            const active = index === step;
            const complete = index < step;
            return (
              <li key={label} className="flex items-center gap-2">
                <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold ${active ? 'border-electric bg-electric text-white' : complete ? 'border-electric/30 bg-electric/10 text-electric' : 'border-ink/15 text-mist-600'}`}>{complete ? '✓' : index + 1}</span>
                <span className={active ? 'font-medium text-ink' : 'text-mist-600'}>{label}</span>
                {index < STEPS.length - 1 && <span className="mx-1 h-px w-5 bg-ink/15" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mt-10">
            {step === 0 && (
              <section aria-labelledby="finder-application">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Step 1</p>
                <h2 id="finder-application" className="h-section mt-2">What are you developing?</h2>
                <p className="lead mt-4">Choose the application closest to your formulation. You can refine it with a formulation goal next.</p>
                {applications.loading ? <div className="mt-10"><Loading /></div> : applications.error ? <div className="mt-10"><ErrorState error={applications.error} onRetry={applications.reload} /></div> : (
                  <GsapRevealGrid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" count={applications.data?.length || 0}>
                    {applications.data.map((item) => (
                      <button key={item.slug} type="button" onClick={() => chooseApplication(item.slug)} className="js-gsap-item group relative flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-3xl bg-navy-900 p-6 text-left text-white transition-[border-color,box-shadow] hover:border-electric/60 hover:shadow-glow sm:min-h-[21rem]">
                        <ApplicationVisual application={item} className="absolute inset-0 h-full w-full opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-transparent" aria-hidden="true" />
                        <span className="relative">
                          <span className="text-xs font-medium text-cyan">{item._count?.products ?? 0} ingredients</span>
                          <span className="mt-1 block font-display text-2xl font-semibold">{item.name}</span>
                          <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan">Select application <span aria-hidden="true">→</span></span>
                        </span>
                      </button>
                    ))}
                  </GsapRevealGrid>
                )}
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="finder-goal">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Step 2</p>
                <h2 id="finder-goal" className="h-section mt-2">What is the formulation goal?</h2>
                <p className="lead mt-4">Choose a primary benefit, or skip to see every ingredient for {selectedApplication?.name}.</p>
                {solutions.loading ? <div className="mt-10"><Loading /></div> : solutions.error ? <div className="mt-10"><ErrorState error={solutions.error} onRetry={solutions.reload} /></div> : (
                  <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {solutions.data.map((item) => (
                      <button key={item.slug} type="button" onClick={() => chooseSolution(item.slug)} className="group rounded-2xl border border-ink/10 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-electric/50 hover:shadow-lift">
                        <span className="font-display text-xl font-semibold">{item.name}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-mist-600">{item.description}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button type="button" variant="outlineDark" onClick={() => setStep(0)}>Back</Button>
                  <Button type="button" onClick={() => chooseSolution('')}>Skip · show all {selectedApplication?.name} ingredients</Button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="finder-results">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Step 3</p>
                <h2 id="finder-results" className="h-section mt-2">Matching ingredients</h2>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-mist px-3 py-1 font-medium text-ink">{selectedApplication?.name}</span>
                  {selectedSolution && <span className="rounded-full bg-mist px-3 py-1 font-medium text-ink">{selectedSolution.name}</span>}
                  <button type="button" onClick={reset} className="font-medium text-electric hover:underline">Start over</button>
                </div>
                <div className="mt-8">
                  {products.loading ? <Loading /> : products.error ? <ErrorState error={products.error} onRetry={products.reload} /> : !products.data?.length ? <EmptyState title="No exact matches yet" text="Try a different formulation goal or browse the full catalogue." action={<Button to="/products" className="mt-6">Browse all products</Button>} /> : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.data.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="outlineDark" onClick={() => setStep(1)}>Change goal</Button><Button to="/products" variant="outlineDark">Browse all products</Button></div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
