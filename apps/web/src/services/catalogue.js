import { request, qs } from './api';

export const catalogue = {
  products: (params) => request(`/products${qs(params)}`),
  product: (slug) => request(`/products/${slug}`).then((j) => j.data),
  categories: () => request('/categories').then((j) => j.data),
  category: (slug) => request(`/categories/${slug}`).then((j) => j.data),
  applications: () => request('/applications').then((j) => j.data),
  application: (slug) => request(`/applications/${slug}`).then((j) => j.data),
  solutions: () => request('/solutions').then((j) => j.data),
  documents: () => request('/documents').then((j) => j.data),
  blog: () => request('/blog').then((j) => j.data),
};
