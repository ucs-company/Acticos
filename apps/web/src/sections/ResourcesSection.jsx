import { Link } from 'react-router-dom';
import { RESOURCE_TYPES } from '@/config/resources';
import Reveal from '@/animations/Reveal';
import { Stagger, StaggerItem } from '@/animations/Stagger';

export default function ResourcesSection() {
  return (
    <section className="section bg-mist">
      <div className="container-page">
        <Reveal><h2 className="h-section">Resources</h2></Reveal>
        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {RESOURCE_TYPES.filter((r) => r.id !== 'faqs').map((r) => (
            <StaggerItem as="li" key={r.id}>
              <Link to={`/resources#${r.id}`} className="block h-full rounded-2xl bg-white p-7 transition hover:-translate-y-1 hover:shadow-lift">
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="mt-2 text-[15px] text-mist-600">{r.text}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
