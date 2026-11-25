import { useParams } from 'react-router-dom';
import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { Loading, ErrorState, EmptyState } from '@/components/States';

const TITLES = { quotes: 'Quote Requests', samples: 'Sample Requests', technical: 'Technical Enquiries', contact: 'Contact Messages' };

// Read-only inbox with status updates. Used for the four enquiry types.
export function AdminInbox() {
  const { type } = useParams();
  const { data, loading, error, reload } = useAsync(() => admin.inbox(type), [type]);
  const update = async (id, body) => { try { await admin.updateInbox(type, id, body); reload(); } catch (e) { alert(e.message); } };
  return (
    <div>
      <h1 className="text-3xl font-semibold">{TITLES[type] || 'Inbox'}</h1>
      <div className="mt-6">
        {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={reload} /> : !data.length ? <EmptyState title="Nothing here yet" text="New submissions from the website will appear here." /> : (
          <ul className="space-y-3">{data.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-semibold">{r.name} <span className="font-normal text-mist-600">{r.company ? `· ${r.company}` : ''}</span></p><p className="text-sm text-electric"><a href={`mailto:${r.email}`}>{r.email}</a></p></div>
                <div className="flex items-center gap-3 text-sm">
                  <time className="text-mist-600" dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleDateString()}</time>
                  {type === 'contact' ? (!r.isRead && <button className="font-medium text-electric" onClick={() => update(r.id, {})}>Mark read</button>)
                    : <select aria-label="Status" className="rounded-lg border border-ink/15 px-2 py-1" value={r.status} onChange={(e) => update(r.id, { status: e.target.value })}><option value="NEW">New</option><option value="IN_PROGRESS">In progress</option><option value="CLOSED">Closed</option></select>}
                </div>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {['product', 'quantity', 'application', 'country', 'phone', 'formulationRequirement', 'question', 'message'].filter((k) => r[k]).map((k) => <div key={k}><dt className="inline text-mist-600">{k}: </dt><dd className="inline">{r[k]}</dd></div>)}
              </dl>
            </li>))}</ul>
        )}
      </div>
    </div>
  );
}

// Generic list for taxonomy resources.
export function AdminList({ resource, title, columns }) {
  const { data, loading, error, reload } = useAsync(() => admin.list(resource), [resource]);
  return (
    <div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="mt-6">
        {loading ? <Loading /> : error ? <ErrorState error={error} onRetry={reload} /> : !data.length ? <EmptyState title="Nothing here yet" text="Create entries through the API or seed script. Editing forms for this section follow the Products pattern." /> : (
          <div className="overflow-x-auto rounded-2xl bg-white"><table className="w-full text-left text-[15px]"><thead className="border-b border-ink/10 text-sm text-mist-600"><tr>{columns.map(([l]) => <th key={l} className="p-4">{l}</th>)}</tr></thead>
            <tbody className="divide-y divide-ink/10">{data.map((r) => <tr key={r.id}>{columns.map(([l, k]) => <td key={l} className="p-4">{String(r[k] ?? '')}</td>)}</tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
}

export const AdminNote = ({ title, text }) => (<div><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-4 max-w-xl text-mist-600">{text}</p></div>);
