import { admin } from '@/services/admin';
import { useAsync } from '@/hooks/useAsync';
import { ErrorState } from '@/components/States';

const Bars = ({ title, rows, empty = 'No data yet' }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="rounded-2xl bg-white p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {!rows.length ? <p className="mt-6 text-sm text-mist-600">{empty}</p> : (
        <ul className="mt-5 space-y-3">{rows.map((r) => (
          <li key={r.label} className="text-sm"><div className="mb-1 flex justify-between gap-3"><span className="truncate">{r.label}</span><span className="font-medium">{r.value}</span></div>
            <div className="h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-gradient-to-r from-cyan to-electric" style={{ width: `${(r.value / max) * 100}%` }} /></div></li>
        ))}</ul>
      )}
    </section>
  );
};

const Trend = ({ rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="rounded-2xl bg-white p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold">Enquiries over time</h2>
      {!rows.length ? <p className="mt-6 text-sm text-mist-600">No enquiries in the last 6 months</p> : (
        <div className="mt-6 flex h-44 items-end gap-3" role="img" aria-label="Monthly enquiries bar chart">
          {rows.map((r) => (<div key={r.label} className="flex flex-1 flex-col items-center gap-2"><span className="text-xs font-medium">{r.value}</span><div className="w-full rounded-t-lg bg-electric" style={{ height: `${(r.value / max) * 100}%`, minHeight: 4 }} /><span className="text-xs text-mist-600">{r.label}</span></div>))}
        </div>
      )}
    </section>
  );
};

export default function Dashboard() {
  const { data, loading, error, reload } = useAsync(() => admin.stats(), []);
  if (loading) return <p>Loading dashboard</p>;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const t = data.totals;
  const cards = [['Total Products', t.products], ['Quote Requests', t.quotes], ['Sample Requests', t.samples], ['Technical Enquiries', t.technical], ['Unread Messages', t.unread]];
  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([l, v]) => <div key={l} className="rounded-2xl bg-white p-5"><p className="text-sm text-mist-600">{l}</p><p className="mt-2 font-display text-4xl font-semibold">{v}</p></div>)}</div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2"><Trend rows={data.enquiriesOverTime} /><Bars title="Requests by category" rows={data.requestsByCategory} /><Bars title="Popular products" rows={data.popularProducts} /><Bars title="Application interest" rows={data.applicationInterest} /></div>
    </div>
  );
}
