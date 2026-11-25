import { Link } from 'react-router-dom';

export default function Breadcrumb({ items, dark = false }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${dark ? 'text-white/60' : 'text-mist-600'}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.to ? <Link to={it.to} className="hover:underline">{it.label}</Link> : <span aria-current="page" className={dark ? 'text-white' : 'text-ink'}>{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
