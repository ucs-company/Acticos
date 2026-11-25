const COUNTRY = { name: 'country', label: 'Country', required: true };
export const quoteFields = (products, apps) => [
  { name: 'name', label: 'Name', required: true }, { name: 'company', label: 'Company', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel' },
  COUNTRY,
  { name: 'product', label: 'Product', required: true, type: 'select', options: products },
  { name: 'quantity', label: 'Quantity / Requirement', required: true },
  { name: 'application', label: 'Application', type: 'select', options: apps },
  { name: 'message', label: 'Message', type: 'textarea' },
];
export const sampleFields = (products, apps) => [
  { name: 'name', label: 'Name', required: true }, { name: 'company', label: 'Company', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'product', label: 'Product', required: true, type: 'select', options: products },
  { name: 'application', label: 'Application', type: 'select', options: apps },
  { name: 'quantity', label: 'Quantity / Sample Requirement', required: true },
  { name: 'message', label: 'Message', type: 'textarea' },
];
export const technicalFields = (products, apps) => [
  { name: 'name', label: 'Name', required: true }, { name: 'company', label: 'Company', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'product', label: 'Product', type: 'select', options: products },
  { name: 'application', label: 'Application', type: 'select', options: apps },
  { name: 'formulationRequirement', label: 'Formulation Requirement', type: 'textarea', rows: 4 },
  { name: 'question', label: 'Technical Question', type: 'textarea', required: true },
  { name: 'attachment', label: 'Attachment (PDF, PNG or JPG, max 10 MB)', type: 'file' },
];
export const contactFields = [
  { name: 'name', label: 'Name', required: true }, { name: 'company', label: 'Company' },
  { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'country', label: 'Country' }, { name: 'message', label: 'Message', type: 'textarea', required: true },
];
