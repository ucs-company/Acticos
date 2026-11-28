import ProductThumb from './ProductThumb';
import { getApplicationMedia, getProductApplication } from '@/config/applicationMedia';
import { cloudinaryImage } from '@/utils/images';

export default function ApplicationVisual({ application, product, className = '', priority = false, showLabel = false }) {
  const app = application || getProductApplication(product);
  const media = app ? getApplicationMedia(app.slug) : null;

  if (!app?.imageUrl && !media) {
    if (product) return <ProductThumb product={product} className={className} />;
    return <div className={`h-full w-full bg-gradient-to-br from-navy-900 via-navy-800 to-electric ${className}`} aria-hidden="true" />;
  }

  const image = app.imageUrl ? cloudinaryImage(app.imageUrl, 1200, 800) : `/images/applications/${app.slug}.webp`;
  const small = app.imageUrl ? cloudinaryImage(app.imageUrl, 600, 400) : `/images/applications/${app.slug}-sm.webp`;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-navy-900 ${className}`}>
      <img
        src={image}
        srcSet={`${small} 768w, ${image} 1536w`}
        sizes={priority ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw'}
        alt={media?.alt || `${app.name} application image`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-900/20 to-transparent" aria-hidden="true" />
      {showLabel && app && (
        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {app.name}
        </span>
      )}
    </div>
  );
}
