export const SITE = {
  name: 'Acticos',
  legalName: 'Acticos International Pvt. Ltd.',
  tagline: 'Advanced ingredients for better formulations.',
  url: import.meta.env.VITE_SITE_URL || 'https://www.acticos.com',
  // [DATA REQUIRED] replace with official contact details
  contact: { email: '[DATA REQUIRED]', phone: '[DATA REQUIRED]', address: '[DATA REQUIRED]' },
};

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Applications', to: '/applications' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'About Acticos', to: '/about' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
];

export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
