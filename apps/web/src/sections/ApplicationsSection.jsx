import { Link } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import { EmptyState, Loading } from '@/components/States';
import Reveal from '@/animations/Reveal';
import { Stagger, StaggerItem } from '@/animations/Stagger';

export default function ApplicationsSection() {
  const { data: applications, loading, error } = useAsync(() => catalogue.applications(), []);
  return (
    <section className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="h-section">Built for the formats you develop</h2>
          <p className="lead mt-4">Find ingredients by where they will be used. Each application links to the matching products.</p>
          <Link to="/applications" className="mt-6 inline-block font-medium text-electric hover:underline">All applications</Link>
        </Reveal>
        {loading ? <Loading /> : error || !applications?.length ? <EmptyState title="Applications unavailable" text="Please try again shortly." /> : (
          <Stagger as="ul" className="grid gap-3 sm:grid-cols-2" stagger={0.07}>
            {applications.map((application) => {
              const count = Number(application._count?.products || 0);
              return (
                <StaggerItem as="li" key={application.slug}>
                  <Link to={`/applications/${application.slug}`} className="group flex items-center justify-between rounded-2xl border border-ink/10 px-6 py-5 transition hover:border-electric/50 hover:bg-mist">
                    <span className="font-display text-xl font-semibold">{application.name}</span>
                    <span className="text-sm text-mist-600">{count} {count === 1 ? 'product' : 'products'}</span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </section>
  );
}
