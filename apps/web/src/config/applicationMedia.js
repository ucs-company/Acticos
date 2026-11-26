export const APPLICATION_MEDIA = {
  'skin-care': {
    label: 'Skin Care',
    alt: 'Aloe skincare still life with water droplets and cream texture',
  },
  'hair-care': {
    label: 'Hair Care',
    alt: 'Haircare still life with aloe, glossy waves and conditioner texture',
  },
  'baby-care': {
    label: 'Baby Care',
    alt: 'Gentle baby skincare still life with soft lotion textures',
  },
  'personal-care': {
    label: 'Personal Care',
    alt: 'Fresh eucalyptus body wash and personal care spa scene',
  },
  'sun-care': {
    label: 'Sun Care',
    alt: 'Mineral sunscreen still life in warm sunlight',
  },
  'color-cosmetics': {
    label: 'Color Cosmetics',
    alt: 'Elegant makeup still life with rose accents and pigment textures',
  },
};

export function getApplicationMedia(slug) {
  return APPLICATION_MEDIA[slug] || null;
}

export function getProductApplication(product) {
  return product?.applications?.[0] || null;
}

export function getProductMedia(product) {
  return getApplicationMedia(getProductApplication(product)?.slug);
}
