import { Stagger, StaggerItem } from '@/animations/Stagger';

const POINTS = [
  { t: 'Quality & Consistency', d: 'Reliable material, batch after batch.', i: <path d="M5 12.5 10 17.5 19 7" /> },
  { t: 'Technical Expertise', d: 'Formulation-minded support.', i: <path d="M9 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-5-10V3M8 3h8" /> },
  { t: 'Specialty Ingredient Portfolio', d: 'Four focused ingredient families.', i: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><circle cx="12" cy="16" r="3" /></> },
  { t: 'Reliable Partnership', d: 'A supplier that stays engaged.', i: <path d="M3 12l5-5 4 3 4-3 5 5-9 8z" /> },
];

export default function TrustStrip() {
  return (
    <section aria-label="Why teams choose Acticos" className="border-b border-ink/10 bg-white">
      <Stagger as="ul" className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ink/10">
        {POINTS.map((p) => (
          <StaggerItem as="li" key={p.t} className="flex items-start gap-4 lg:px-8 lg:first:pl-0">
            <svg className="mt-0.5 h-7 w-7 shrink-0 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p.i}</svg>
            <div><h3 className="text-base font-semibold">{p.t}</h3><p className="mt-1 text-sm text-mist-600">{p.d}</p></div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
