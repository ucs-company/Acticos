import { request, get, qs, tokenStore } from './api';

export const admin = {
  login: (email, password) => request('/admin/auth/login', { method: 'POST', body: { email, password } }).then((j) => j.data),
  me: () => get('/admin/auth/me', { auth: true }),
  stats: () => get('/admin/stats', { auth: true }),
  products: (params) => request(`/admin/products${qs(params)}`, { auth: true }),
  product: (id) => get(`/admin/products/${id}`, { auth: true }),
  saveProduct: (id, body) => request(id ? `/admin/products/${id}` : '/admin/products', { method: id ? 'PUT' : 'POST', body, auth: true }),
  setStatus: (id, publish) => request(`/admin/products/${id}/${publish ? 'publish' : 'unpublish'}`, { method: 'PATCH', auth: true }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE', auth: true }),
  list: (resource) => get(`/admin/${resource}`, { auth: true }),
  create: (resource, body) => request(`/admin/${resource}`, { method: 'POST', body, auth: true }),
  update: (resource, id, body) => request(`/admin/${resource}/${id}`, { method: 'PUT', body, auth: true }),
  save: (resource, id, body) => request(id ? `/admin/${resource}/${id}` : `/admin/${resource}`, { method: id ? 'PUT' : 'POST', body, auth: true }),
  remove: (resource, id) => request(`/admin/${resource}/${id}`, { method: 'DELETE', auth: true }),
  uploadDocument: (body) => request('/admin/documents', { method: 'POST', body, auth: true }),
  uploadProductImage: (id, file) => {
    const body = new FormData();
    body.append('image', file);
    return request(`/admin/products/${id}/image`, { method: 'POST', body, auth: true });
  },
  uploadApplicationImage: (id, file) => {
    const body = new FormData();
    body.append('image', file);
    return request(`/admin/applications/${id}/image`, { method: 'POST', body, auth: true });
  },
  inbox: (type) => get(`/admin/inbox/${type}`, { auth: true }),
  updateInbox: (type, id, body) => request(`/admin/inbox/${type}/${id}`, { method: 'PATCH', body, auth: true }),
};
export { tokenStore };
