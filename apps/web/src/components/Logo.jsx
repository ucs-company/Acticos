const HEIGHTS = { sm: 'h-7', md: 'h-10', lg: 'h-12', xl: 'h-16' };

export default function Logo({ className = '', variant = 'light', size = 'md' }) {
  const src = variant === 'dark' ? '/acticos-logo.png' : '/acticos-logo-light.png';
  return (
    <img
      src={src}
      alt="Acticos International"
      draggable={false}
      className={`w-auto select-none ${HEIGHTS[size] || HEIGHTS.md} ${className}`}
    />
  );
}
