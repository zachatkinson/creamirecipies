import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { x as maybeRenderHead, a2 as addAttribute, L as renderTemplate } from './sequence_B8w407xz.mjs';
import 'clsx';

const $$AdUnit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdUnit;
  const { size, slot: adSlot = "default", class: className = "", lazy = true } = Astro2.props;
  const sizeConfig = {
    "leaderboard": { width: "728px", height: "90px", minHeight: "90px", label: "728x90 Leaderboard" },
    "mobile-banner": { width: "320px", height: "50px", minHeight: "50px", label: "320x50 Mobile Banner" },
    "medium-rectangle": { width: "300px", height: "250px", minHeight: "250px", label: "300x250 Medium Rectangle" },
    "large-rectangle": { width: "336px", height: "280px", minHeight: "280px", label: "336x280 Large Rectangle" },
    "half-page": { width: "300px", height: "600px", minHeight: "600px", label: "300x600 Half Page" },
    "in-article": { width: "100%", height: "auto", minHeight: "250px", label: "In-Article (Responsive)", responsive: true }
  };
  const config = sizeConfig[size];
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "ad-zone",
    `ad-${size}`,
    className,
    // Hide on wrong viewport
    size === "leaderboard" && "hidden md:block",
    size === "mobile-banner" && "block md:hidden",
    size === "half-page" && "hidden lg:block"
  ], "class:list")}${addAttribute(adSlot, "data-ad-slot")}${addAttribute(size, "data-ad-size")}${addAttribute(lazy, "data-ad-lazy")} aria-hidden="true" role="complementary" aria-label="Advertisement"${addAttribute(`max-width: ${config.width}; min-height: ${config.minHeight}; margin: 0 auto;`, "style")}> ${renderTemplate`<!-- Production: ad network script will fill this -->
    <div class="ad-container"${addAttribute(`width: 100%; min-height: ${config.minHeight}; max-width: ${config.width};`, "style")}> <!-- Ad code injected by ad network script in BaseLayout --> </div>`} </div>`;
}, "/Users/zach/web-projects/creami/src/components/ads/AdUnit.astro", void 0);

export { $$AdUnit as $ };
