/**
 * Image optimization utilities for Creami Recipes.
 *
 * Provides helper functions and constants for working with images stored in
 * Supabase Storage, including URL-based transforms.
 */

/** Standard image size presets (px) */
export const IMAGE_SIZES = {
  thumbnail: 200,
  card: 400,
  hero: 800,
  full: 1200,
} as const;

export type ImageSizeName = keyof typeof IMAGE_SIZES;

const SUPABASE_STORAGE_HOST = 'qilbrsswjhnjdkbdvdll.supabase.co';

/**
 * Get an optimized image URL. For Supabase Storage images, appends Supabase
 * image transformation parameters. For external URLs, returns as-is.
 *
 * @param url - The original image URL
 * @param width - Target width in pixels (uses IMAGE_SIZES.full by default)
 * @param quality - AVIF quality 1-100 (default 70)
 * @returns Transformed URL string
 *
 * @example
 * ```ts
 * getOptimizedUrl(photoUrl, IMAGE_SIZES.card)
 * getOptimizedUrl(photoUrl, 600, 80)
 * ```
 */
export function getOptimizedUrl(
  url: string,
  width: number = IMAGE_SIZES.full,
  quality: number = 70,
): string {
  if (!url) return url;

  // Only transform Supabase Storage URLs
  if (!url.includes(SUPABASE_STORAGE_HOST)) {
    return url;
  }

  // Supabase Storage image transforms use the /render/image/public path
  // Convert /storage/v1/object/public/BUCKET/PATH
  // to     /storage/v1/render/image/public/BUCKET/PATH?width=W&quality=Q
  const transformedUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/',
  );

  const separator = transformedUrl.includes('?') ? '&' : '?';
  return `${transformedUrl}${separator}width=${width}&quality=${quality}`;
}

/**
 * Get a URL for a named size preset.
 *
 * @example
 * ```ts
 * getPresetUrl(photoUrl, 'thumbnail') // 200px wide
 * getPresetUrl(photoUrl, 'hero')      // 800px wide
 * ```
 */
export function getPresetUrl(url: string, size: ImageSizeName): string {
  return getOptimizedUrl(url, IMAGE_SIZES[size]);
}
