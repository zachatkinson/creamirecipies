import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { x as maybeRenderHead, a2 as addAttribute, b8 as renderSlot, L as renderTemplate } from './sequence_B8w407xz.mjs';
import 'clsx';
import { r as renderScript } from './BaseLayout_C4z3TKmE.mjs';

const $$ScrollReveal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ScrollReveal;
  const {
    class: className = "",
    animation = "fade-up",
    delay = 0,
    staggerAmount = 0.1
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["scroll-reveal", className], "class:list")}${addAttribute(animation, "data-animation")}${addAttribute(delay, "data-delay")}${addAttribute(staggerAmount, "data-stagger")}> ${renderSlot($$result, $$slots["default"])} </div> ${renderScript($$result, "/Users/zach/web-projects/creami/src/components/animations/ScrollReveal.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/zach/web-projects/creami/src/components/animations/ScrollReveal.astro", void 0);

export { $$ScrollReveal as $ };
