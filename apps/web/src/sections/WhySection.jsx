import Reveal from '@/animations/Reveal';
import { Stagger, StaggerItem } from '@/animations/Stagger';

const PILLARS = [
  { t: 'Quality', d: 'Specifications, documentation and supply requirements are part of the conversation from the start.' },
  { t: 'Consistency', d: 'Predictable behaviour from one batch to the next.' },
  { t: 'Technical Expertise', d: 'People who understand how an ingredient performs in a real formula.' },
  { t: 'Innovation', d: 'A portfolio that includes proprietary blend actives.' },
  { t: 'Partnership', d: 'Responsive support from first enquiry to repeat supply.' },
];

export default function WhySection() {
  return (
    <section className="section relative overflow-hidden bg-navy-900 text-white">
      <div className="grid-bg absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" aria-hidden="true" />
      <div className="container-page relative">
        <Reveal><h2 className="h-section max-w-3xl">Why formulators work with Acticos</h2></Reveal>
        <Stagger as="dl" className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-6" stagger={0.09}>
          {PILLARS.map((p, i) => (
            <StaggerItem as="div" key={p.t} className={`bg-navy-900 p-8 ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}>
              <dt className="font-display text-2xl font-semibold">{p.t}</dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-white/65">{p.d}</dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
