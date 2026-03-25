import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { x as maybeRenderHead, a2 as addAttribute, L as renderTemplate } from './sequence_B8w407xz.mjs';
import 'clsx';

const $$StepCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StepCard;
  const { step, totalSteps } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="step-card group relative pl-12 pb-8"${addAttribute(step.step_number, "data-step")}> <!-- Timeline connector --> ${step.step_number < totalSteps && renderTemplate`<div class="absolute left-[1.15rem] top-10 bottom-0 w-0.5 bg-gradient-to-b from-blush to-lavender/30"></div>`} <!-- Step number bubble --> <div class="absolute left-0 top-0 w-9 h-9 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-white font-bold text-sm shadow-md"> ${step.step_number} </div> <!-- Card --> <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"> <p class="text-slate-700 leading-relaxed">${step.instruction}</p> ${step.hint && renderTemplate`<details class="mt-3 group/hint"> <summary class="flex items-center gap-2 text-sm font-medium text-mint-dark cursor-pointer hover:text-mint-dark/80 transition-colors"> <svg class="w-4 h-4 transition-transform group-open/hint:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg>
Pro Tip
</summary> <div class="mt-2 pl-6 text-sm text-slate-500 bg-mint/10 rounded-lg p-3 border-l-2 border-mint"> ${step.hint} </div> </details>`} ${step.duration_minutes && renderTemplate`<div class="mt-3 flex items-center gap-1.5 text-xs text-slate-500"> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
~${step.duration_minutes} min
</div>`} ${step.image_url && renderTemplate`<img${addAttribute(step.image_url, "src")}${addAttribute(`Step ${step.step_number}`, "alt")} class="mt-4 rounded-lg w-full max-h-64 object-cover" loading="lazy">`} </div> </div>`;
}, "/Users/zach/web-projects/creami/src/components/recipe/StepCard.astro", void 0);

export { $$StepCard as $ };
