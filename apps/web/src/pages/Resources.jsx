import { useMemo, useState } from 'react';
import { RESOURCE_TYPES } from '@/config/resources';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import PageHero from '@/components/PageHero';
import { EmptyState, ErrorState, Loading } from '@/components/States';
import Reveal from '@/animations/Reveal';
import { Stagger, StaggerItem } from '@/animations/Stagger';
import Seo from '@/components/Seo';

const FAQS = [{ q: 'How do I request a sample?', a: 'Use the Request a Sample form and tell us the product and the application.' }];

const DOCUMENT_GROUP = {
  CATALOGUE: 'catalogue',
  TDS: 'tds',
  SDS: 'sds',
  APPLICATION_NOTE: 'application-notes',
  FORMULATION_GUIDE: 'formulation-guides',
  OTHER: 'application-notes',
};

export default function Resources() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const { data, loading, error, reload } = useAsync(async () => {
    const [documents, blog] = await Promise.all([catalogue.documents(), catalogue.blog()]);
    return { documents, blog };
  }, []);

  const groups = useMemo(() => {
    const result = Object.fromEntries(RESOURCE_TYPES.map((resource) => [resource.id, []]));
    for (const document of data?.documents || []) {
      const group = DOCUMENT_GROUP[document.type] || 'application-notes';
      result[group].push({
        title: document.title,
        detail: [document.type, document.product?.name].filter(Boolean).join(' · '),
        href: document.fileUrl,
      });
    }
    for (const post of data?.blog || []) {
      result.knowledge.push({ title: post.title, detail: post.excerpt || '', href: null });
    }
    return result;
  }, [data]);

  const shown = useMemo(() =>
    RESOURCE_TYPES.filter((resource) =>
      (!type || resource.id === type) &&
      `${resource.title} ${resource.text}`.toLowerCase().includes(q.toLowerCase())), [q, type]);

  return (
    <>
      <Seo title="Resources" description="Catalogues, data sheets and formulation guidance from Acticos." path="/resources" />
      <PageHero title="Resource centre" text="Documents and guidance for evaluating and formulating with Acticos ingredients." crumbs={[{ label: 'Home', to: '/' }, { label: 'Resources' }]} />
      <div className="container-page py-16">
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-[1fr_260px]">
            <div><label htmlFor="rs" className="sr-only">Search resources</label><input id="rs" type="search" className="field" placeholder="Search resources" value={q} onChange={(event) => setQ(event.target.value)} /></div>
            <select aria-label="Filter resource type" className="field" value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option>{RESOURCE_TYPES.map((resource) => <option key={resource.id} value={resource.id}>{resource.title}</option>)}</select>
          </div>
        </Reveal>

        {loading ? <div className="mt-10"><Loading /></div> : null}
        {error ? <div className="mt-10"><ErrorState error={error} onRetry={reload} /></div> : null}
        {!loading && !error && !shown.length ? <div className="mt-10"><EmptyState title="No resources found" text="Try a different search term." /></div> : null}

        {!loading && !error && shown.length ? (
          <Stagger key={`${q}|${type}`} className="mt-10 space-y-10" stagger={0.07}>
            {shown.map((resource) => (
              <StaggerItem as="section" key={resource.id} id={resource.id} className="scroll-mt-28 border-t border-ink/10 pt-8">
                <h2 className="text-2xl font-semibold">{resource.title}</h2>
                <p className="mt-1 text-mist-600">{resource.text}</p>
                {resource.id === 'faqs' ? (
                  <dl className="mt-5 space-y-4">{FAQS.map((item) => <div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="text-mist-600">{item.a}</dd></div>)}</dl>
                ) : groups[resource.id]?.length ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {groups[resource.id].map((item, index) => (
                      <li key={`${item.title}-${index}`} className="rounded-xl border border-ink/10 bg-white p-4">
                        {item.href ? (
                          <a className="font-medium text-electric hover:underline" href={item.href} target="_blank" rel="noreferrer">{item.title}</a>
                        ) : <p className="font-medium">{item.title}</p>}
                        {item.detail && <p className="mt-1 text-sm text-mist-600">{item.detail}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl bg-mist p-4 text-sm text-mist-600">No documents in this section yet.</p>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </div>
    </>
  );
}
