const THEMES = {
  'preservatives-speciality-ingredients': 'from-[#16301D] via-[#2F5D2E] to-[#6FAF42]',
  'active-ingredients': 'from-[#1C2A17] via-[#3F7024] to-[#9CCB78]',
  'emmolient-esters': 'from-[#1F2A22] via-[#4A6B3A] to-[#86B363]',
  'proprietery-blend-actives': 'from-[#14251A] via-[#2F6B2E] to-[#6FAF42]',
};

// Lightweight, CSS/SVG-only product visual (no per-card canvas) that echoes the brand's bubbly "O".
export default function ProductThumb({ product, className = '' }) {
  const theme = THEMES[product.category?.slug] || 'from-navy-900 via-navy-800 to-electric';
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${theme} ${className}`}>
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.6)_1px,transparent_0)] [background-size:18px_18px]" aria-hidden="true" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

      <svg className="thumb-float absolute right-5 top-5 h-16 w-16 opacity-90" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="30" cy="38" r="16" stroke="rgba(255,255,255,.85)" strokeWidth="5" />
        <circle cx="30" cy="40" r="6" fill="rgba(255,255,255,.9)" />
        <circle cx="46" cy="12" r="3.5" fill="rgba(255,255,255,.8)" />
        <circle cx="54" cy="20" r="2.4" fill="rgba(255,255,255,.6)" />
        <circle cx="39" cy="10" r="2" fill="rgba(255,255,255,.55)" />
      </svg>

      <svg className="absolute -bottom-12 -left-12 h-56 w-56 opacity-30" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="92" stroke="white" strokeWidth="1" strokeDasharray="2 6" />
      </svg>

      <span className="absolute bottom-4 left-5 font-display text-sm font-semibold tracking-wide text-white/85">{product.code}</span>
      <div className="pointer-events-none absolute inset-0 -translate-x-full rotate-12 bg-white/20 blur-xl transition-transform duration-700 ease-out group-hover:translate-x-[220%]" aria-hidden="true" />
    </div>
  );
}
