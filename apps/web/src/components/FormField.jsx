import { useId } from 'react';

export default function FormField({ field, value, error, onChange }) {
  const id = useId();
  const { name, label, type = 'text', required, options, placeholder, rows = 5 } = field;
  const common = {
    id, name, required, value: value ?? '', 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-err` : undefined,
    className: `field ${error ? 'field-error' : ''}`, placeholder,
  };
  return (
    <div className={type === 'textarea' ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}{required && <span className="text-red-600" aria-hidden="true"> *</span>}</label>
      {type === 'textarea' ? <textarea {...common} rows={rows} onChange={(e) => onChange(name, e.target.value)} />
        : type === 'select' ? (
          <select {...common} onChange={(e) => onChange(name, e.target.value)}>
            <option value="">Select</option>
            {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
          </select>
        ) : type === 'file' ? (
          <input id={id} name={name} type="file" accept="application/pdf,image/png,image/jpeg" className="field file:mr-4 file:rounded-full file:border-0 file:bg-mist file:px-4 file:py-1.5 file:text-sm" onChange={(e) => onChange(name, e.target.files?.[0] || null)} />
        ) : <input {...common} type={type} onChange={(e) => onChange(name, e.target.value)} />}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
