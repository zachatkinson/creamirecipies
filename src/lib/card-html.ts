/** Client-side card HTML renderers for dynamic "load more" features.
 * These mirror the Astro component markup to prevent drift. */

import { CATEGORY_COLORS } from './blog';

/** Render a blog post card as an HTML string (for client-side load-more) */
export function renderBlogPostCardHtml(
  post: { slug: string; title: string; excerpt?: string; category: string; hero_image_url?: string; published_at?: string; created_at?: string },
  locale: string,
): string {
  const heroSrc = post.hero_image_url || `/images/blog/${post.category || 'news'}.svg`;
  const heroBase = heroSrc.replace('.avif', '');
  const isAvif = heroSrc.endsWith('.avif');
  const srcsetAttr = isAvif
    ? ` srcset="${heroBase}-384w.avif 384w, ${heroBase}-768w.avif 768w, ${heroSrc} 1200w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"`
    : '';
  const date = new Date(post.published_at || post.created_at || '').toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-600';

  return `<div class="aspect-[16/9] bg-cream-dark overflow-hidden">
      <img src="${heroSrc}"${srcsetAttr} alt="${post.title}" width="1200" height="675" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
    </div>
    <div class="p-5">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}">${post.category}</span>
        <time class="text-xs text-slate-600">${date}</time>
      </div>
      <h2 class="font-display text-lg font-bold text-chocolate group-hover:text-berry transition-colors line-clamp-2 mb-2">${post.title}</h2>
      ${post.excerpt ? `<p class="text-sm text-slate-600 line-clamp-3">${post.excerpt}</p>` : ''}
    </div>`;
}

/** CSS class string for blog/recipe card wrapper links */
export const CARD_LINK_CLASS = 'group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1';
