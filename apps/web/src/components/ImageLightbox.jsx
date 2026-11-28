import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cloudinaryImage } from '@/utils/images';

export default function ImageLightbox({ src, alt = 'Image preview', onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [src, onClose]);

  if (!src) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[130] flex flex-col bg-black/95 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex shrink-0 items-center justify-between gap-4 text-white">
        <p className="truncate text-sm text-white/80">{alt}</p>
        <button type="button" onClick={onClose} aria-label="Close image preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white/60">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
        </button>
      </div>
      <button type="button" onClick={onClose} aria-label="Close image preview" className="flex min-h-0 flex-1 cursor-zoom-out items-center justify-center py-4">
        <img src={cloudinaryImage(src, 1800, 1400, 'c_fit')} alt={alt} className="max-h-full max-w-full rounded-xl object-contain" />
      </button>
    </div>,
    document.body,
  );
}
