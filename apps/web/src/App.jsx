import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { AuthProvider } from '@/hooks/useAuth';

const lz = (f) => lazy(f);
const Home = lz(() => import('@/pages/Home'));
const Products = lz(() => import('@/pages/Products'));
const FindIngredient = lz(() => import('@/pages/FindIngredient'));
const Applications = lz(() => import('@/pages/Applications'));
const ApplicationDetail = lz(() => import('@/pages/ApplicationDetail'));
const Solutions = lz(() => import('@/pages/Solutions'));
const About = lz(() => import('@/pages/About'));
const Resources = lz(() => import('@/pages/Resources'));
const Contact = lz(() => import('@/pages/Contact'));
const EnquiryPage = lz(() => import('@/pages/EnquiryPage'));
const NotFound = lz(() => import('@/pages/NotFound'));
const AdminLayout = lz(() => import('@/layouts/AdminLayout'));
const Login = lz(() => import('@/pages/admin/Login'));
const Dashboard = lz(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lz(() => import('@/pages/admin/AdminProducts'));
const AdminCrud = lz(() => import('@/pages/admin/AdminCrud'));
const AdminDocuments = lz(() => import('@/pages/admin/AdminDocuments'));
const AdminInbox = lz(() => import('@/pages/admin/AdminTable').then((m) => ({ default: m.AdminInbox })));
const AdminNote = lz(() => import('@/pages/admin/AdminTable').then((m) => ({ default: m.AdminNote })));
const AdminSettings = lz(() => import('@/pages/admin/AdminSettings'));

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<Products />} />
          <Route path="find-ingredient" element={<FindIngredient />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:slug" element={<ApplicationDetail />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="about" element={<About />} />
          <Route path="resources" element={<Resources />} />
          <Route path="contact" element={<Contact />} />
          <Route path="request-quote" element={<EnquiryPage kind="quote" />} />
          <Route path="request-sample" element={<EnquiryPage kind="sample" />} />
          <Route path="technical-enquiry" element={<EnquiryPage kind="technical" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCrud resource="categories" />} />
          <Route path="applications" element={<AdminCrud resource="applications" />} />
          <Route path="solutions" element={<AdminCrud resource="solutions" />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="blog" element={<AdminCrud resource="blog" />} />
          <Route path="resources" element={<AdminNote title="Resources" text="Resources are Documents grouped by type. Upload TDS, SDS, catalogues and guides under Documents." />} />
          <Route path="inbox/:type" element={<AdminInbox />} />
          <Route path="seo" element={<AdminNote title="SEO" text="Per-product and per-category SEO title and description are edited on each record. The sitemap is served at /sitemap.xml." />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
