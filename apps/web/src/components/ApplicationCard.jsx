import { Link } from 'react-router-dom';
import ApplicationVisual from './ApplicationVisual';
import GsapImageParallax from '@/animations/GsapImageParallax';

export default function ApplicationCard({ application, className = '' }) {
  const count = Number(application._count?.products || 0);
  return (
    <Link
      to={`/applications/${application.slug}`}
      className={`js-gsap-item group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-navy-900 p-6 text-white transition-[border-color,box-shadow] duration-300 hover:border-electric/60 hover:shadow-glow sm:min-h-[24rem] sm:p-7 ${className}`}
    >
      <GsapImageParallax className="absolute inset-0" amount={4}>
        <ApplicationVisual application={application} className="h-full w-full opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      </GsapImageParallax>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/10" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-3">
        <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm">
          {count} {count === 1 ? 'product' : 'products'}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white/80 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" /></svg>
        </span>
      </div>

      <div className="relative mt-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan/90">Application</p>
        <h3 className="mt-2 font-display text-3xl font-semibold leading-tight">{application.name}</h3>
        {application.description && <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-white/70 line-clamp-2">{application.description}</p>}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan">
          Explore products
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
      </div>
    </Link>
  );
}
