import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { x as maybeRenderHead, a2 as addAttribute, L as renderTemplate } from './sequence_B8w407xz.mjs';
import 'clsx';

const $$RatingStars = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RatingStars;
  const { rating, size = "md", showValue = false } = Astro2.props;
  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  const starSize = sizes[size];
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center gap-0.5" role="img"${addAttribute(`${rating.toFixed(1)} out of 5 stars`, "aria-label")}> ${Array.from({ length: fullStars }).map(() => renderTemplate`<svg${addAttribute([starSize, "text-vanilla-dark"], "class:list")} fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} ${hasHalf && renderTemplate`<svg${addAttribute([starSize, "text-vanilla-dark"], "class:list")} viewBox="0 0 20 20"> <defs> <linearGradient id="half-star"> <stop offset="50%" stop-color="currentColor"></stop> <stop offset="50%" stop-color="#E2E8F0"></stop> </linearGradient> </defs> <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`} ${Array.from({ length: emptyStars }).map(() => renderTemplate`<svg${addAttribute([starSize, "text-slate-200"], "class:list")} fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} ${showValue && renderTemplate`<span class="ml-1 text-sm font-medium text-slate-600">${rating.toFixed(1)}</span>`} </div>`;
}, "/Users/zach/web-projects/creami/src/components/recipe/RatingStars.astro", void 0);

export { $$RatingStars as $ };
