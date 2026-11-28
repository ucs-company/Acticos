export function cloudinaryImage(url, width, height, crop = 'c_fill') {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const transforms = [`f_auto`, `q_auto`, crop, width && `w_${width}`, height && `h_${height}`].filter(Boolean).join(',');
  return url.replace('/upload/', `/upload/${transforms}/`);
}
