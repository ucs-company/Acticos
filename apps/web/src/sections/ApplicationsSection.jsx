import { Link } from 'react-router-dom';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import { EmptyState, Loading } from '@/components/States';
import Reveal from '@/animations/Reveal';
import GsapRevealGrid from '@/animations/GsapRevealGrid';
import ApplicationCard from '@/components/ApplicationCard';

export default function ApplicationsSection() {
  const { data: applications, loading, error } = useAsync(() => catalogue.applications(), []);
  return (
    <section className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-electric">Applications</p>
          <h2 className="h-section mt-3">Built for the formats you develop</h2>
          <p className="lead mt-4">Find ingredients by where they will be used. Each application links to the matching products.</p>
          <Link to="/applications" className="mt-6 inline-flex items-center gap-2 font-medium text-electric hover:underline">
            All applications
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
        </Reveal>
        {loading ? <Loading /> : error || !applications?.length ? <EmptyState title="Applications unavailable" text="Please try again shortly." /> : (
          <GsapRevealGrid className="grid gap-4 sm:grid-cols-2" count={applications.length}>
            {applications.map((application) => <ApplicationCard key={application.slug} application={application} />)}
          </GsapRevealGrid>
        )}
      </div>
    </section>
  );
}
