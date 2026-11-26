import { Link } from 'react-router-dom';
import { NAV, SITE } from '@/config/site';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import Logo from '@/components/Logo';

export default function Footer() {
  const { data: categories } = useAsync(() => catalogue.categories(), []);
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed">{SITE.tagline}</p>
          <p className="mt-6 text-sm">{SITE.legalName}</p>
          <p className="mt-1 max-w-xs text-sm leading-relaxed">{SITE.contact.offices[0].address}</p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-medium text-white">Products</h2>
          <ul className="space-y-2.5 text-[15px]">{(categories || []).map((category) => <li key={category.slug}><Link className="hover:text-white" to={`/products/${category.slug}`}>{category.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-medium text-white">Company</h2>
          <ul className="space-y-2.5 text-[15px]">{NAV.slice(2).map((item) => <li key={item.to}><Link className="hover:text-white" to={item.to}>{item.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-medium text-white">Enquire</h2>
          <ul className="space-y-2.5 text-[15px]">
            <li><Link className="hover:text-white" to="/request-quote">Request a Quote</Link></li>
            <li><Link className="hover:text-white" to="/request-sample">Request a Sample</Link></li>
            <li><Link className="hover:text-white" to="/technical-enquiry">Technical Enquiry</Link></li>
          </ul>
          <p className="mt-6 text-sm">{SITE.contact.email}</p>
          <p className="mt-1 text-sm">{SITE.contact.phone}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm">© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</div>
    </footer>
  );
}
