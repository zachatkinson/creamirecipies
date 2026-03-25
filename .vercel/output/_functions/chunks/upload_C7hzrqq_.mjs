import sharp from 'sharp';
import { c as createSupabaseAdmin } from './supabase_DxTYJlbZ.mjs';

const prerender = false;
const MAX_DIMENSION = 1200;
const AVIF_QUALITY = 70;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const POST = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return jsonResponse({ error: "Expected multipart/form-data" }, 400);
    }
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket") || "review-photos";
    const pathPrefix = formData.get("path-prefix") || "";
    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: "No file provided" }, 400);
    }
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ error: "File too large (max 10MB)" }, 400);
    }
    if (!file.type.startsWith("image/")) {
      return jsonResponse({ error: "File must be an image" }, 400);
    }
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    let pipeline = image;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      pipeline = pipeline.resize({
        width: width >= height ? MAX_DIMENSION : void 0,
        height: height > width ? MAX_DIMENSION : void 0,
        fit: "inside",
        withoutEnlargement: true
      });
    }
    const avifBuffer = await pipeline.avif({ quality: AVIF_QUALITY }).toBuffer();
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const prefix = pathPrefix ? `${pathPrefix}/` : "";
    const storagePath = `${prefix}${timestamp}-${random}.avif`;
    const supabase = createSupabaseAdmin();
    const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, avifBuffer, {
      contentType: "image/avif",
      cacheControl: "31536000",
      // 1 year
      upsert: false
    });
    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return jsonResponse({ error: `Upload failed: ${uploadError.message}` }, 500);
    }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return jsonResponse({
      url: publicUrl,
      path: storagePath,
      size: avifBuffer.length,
      originalSize: inputBuffer.length
    });
  } catch (err) {
    console.error("Image upload error:", err);
    const message = err instanceof Error ? err.message : "Image processing failed";
    return jsonResponse({ error: message }, 500);
  }
};
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
