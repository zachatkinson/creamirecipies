/** Responsive image srcset helpers */

interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
}

/** Build srcset for blog images (16:9 aspect, 384w/768w/1200w variants) */
export function buildBlogImageSrcset(imageUrl: string): ResponsiveImage {
  const base = imageUrl.replace('.avif', '');
  return {
    src: imageUrl,
    srcset: `${base}-384w.avif 384w, ${base}-768w.avif 768w, ${imageUrl} 1200w`,
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px',
  };
}

/** Build srcset for recipe card images (4:3 aspect, 384w/768w/800w variants) */
export function buildRecipeImageSrcset(imageUrl: string): ResponsiveImage {
  const base = imageUrl.replace('.avif', '');
  return {
    src: imageUrl,
    srcset: `${base}-384w.avif 384w, ${base}-768w.avif 768w, ${imageUrl} 800w`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px',
  };
}
