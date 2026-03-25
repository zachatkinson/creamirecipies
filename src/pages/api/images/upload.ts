/**
 * Server-side AVIF image conversion endpoint.
 *
 * Accepts image uploads (JPEG, PNG, WebP, HEIC, etc.), converts to AVIF using
 * sharp, resizes to max 1200px on the longest side, and uploads to Supabase
 * Storage. Returns the public URL of the uploaded AVIF image.
 *
 * POST /api/images/upload
 * Content-Type: multipart/form-data
 * Body: file (image), bucket (string, default "review-photos"), path-prefix (string, optional)
 */
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { createSupabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

const MAX_DIMENSION = 1200;
const AVIF_QUALITY = 70;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB input limit

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'Expected multipart/form-data' }, 400);
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const bucket = (formData.get('bucket') as string) || 'review-photos';
    const pathPrefix = (formData.get('path-prefix') as string) || '';

    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: 'No file provided' }, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ error: 'File too large (max 10MB)' }, 400);
    }

    // Validate that it looks like an image
    if (!file.type.startsWith('image/')) {
      return jsonResponse({ error: 'File must be an image' }, 400);
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Convert to AVIF with sharp
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    // Resize if needed (max dimension on longest side)
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    let pipeline = image;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      pipeline = pipeline.resize({
        width: width >= height ? MAX_DIMENSION : undefined,
        height: height > width ? MAX_DIMENSION : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const avifBuffer = await pipeline
      .avif({ quality: AVIF_QUALITY })
      .toBuffer();

    // Generate storage path
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const prefix = pathPrefix ? `${pathPrefix}/` : '';
    const storagePath = `${prefix}${timestamp}-${random}.avif`;

    // Upload to Supabase Storage
    const supabase = createSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, avifBuffer, {
        contentType: 'image/avif',
        cacheControl: '31536000', // 1 year
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return jsonResponse({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return jsonResponse({
      url: publicUrl,
      path: storagePath,
      size: avifBuffer.length,
      originalSize: inputBuffer.length,
    });
  } catch (err) {
    console.error('Image upload error:', err);
    const message = err instanceof Error ? err.message : 'Image processing failed';
    return jsonResponse({ error: message }, 500);
  }
};

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
