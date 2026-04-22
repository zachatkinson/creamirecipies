/**
 * For the 28 posts we just touched, scan for remaining stripped words.
 *
 * Uses specific unambiguous word-level patterns rather than "whole-body"
 * diacritic check.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Unambiguous FR patterns still stripped. If any of these appear, the post needs more work.
const FR_STILL_STRIPPED = [
  /\bdebut\b/, /\bdebutant/, /\bdebute/,
  /\bamelior/, /\bameliore/,
  /\bcoute\b/, /\bcoutent/, /\bcouter/,
  /\bverifier/, /\bverif/,
  /\brealiser/, /\brealiste/,
  /\benlev/, /\beleve/, // ambiguous? skip
  /\bexperience/, /\bexperiences/,
  /\bnumer/,
  /\btele/,
  /\bsere/, // ambiguous
  /\bsouvenir/, // correct as-is
  /\bpaye/, /\bpayer/, /\bpayes?\b/,
  /\bdejeuner/,
  /\bancienne\b/, // correct
  /\bresume\b/, /\bresumer\b/,
  /\bsouvent\b/, // correct
  /\barriere\b/, /\barrieres\b/,
  /\bcoter\b/, /\bcotes?\b/,
  /\bcordee\b/, // ambig
  /\bregles?\b/,
  /\bregulier/,
  /\bdiner\b/, /\bdiners\b/,
  /\baieul/, // rare
  /\bmelange\b/, // already in dict
];

const PT_STILL_STRIPPED = [
  /\bcao\b(?!-)/, // "cao" → "cão" (avoid "cao-" at start of hyphenated)
  /[a-z]{3,}cao\b/,
  /[a-z]{3,}coes\b/,
  /\bensino\b/, // correct
  /\bja\b/, // "já" (ambiguous with "ja" which isn't standard)
  /\be\b/, // ambiguous (é vs e)
  /\bcria\w+/, // check for "criação"
  /\bcriacao\b/, /\bcriacoes\b/,
  /\bdeciso\b/, /\bdecisao\b/, /\bdecisoes\b/,
  /\binspiracao\b/, /\binspiracoes\b/,
  /\bgeracao\b/, /\bgeracoes\b/,
  /\bconstrucao\b/, /\bconstrucoes\b/,
  /\bdistincao\b/, /\bdistincoes\b/,
  /\bapreciacao\b/, /\bapreciacoes\b/,
  /\brazao\b/, /\brazoes\b/,
  /\bcamara\b/, /\bcamaras\b/,
  /\bmassa\b/, // correct
  /\bculinaria\b/, /\bCulinaria\b/,
  /\bfamilia\b/, /\bfamilias\b/, /\bFamilia\b/,
  /\bhistoria\b/, /\bhistorias\b/, /\bHistoria\b/,
  /\bmemoria\b/, /\bMemoria\b/,
  /\bmateria\b/, /\bmaterias\b/,
  /\bareas?\b/, // "área"
  /\bpolicia\b/,
  /\boficial\b/, // correct
  /\binicio\b/, /\bInicio\b/,
  /\bnumero\b/, /\bnumeros\b/, /\bNumero\b/,
  /\bcomercio\b/,
  /\bsinonimo/,
  /\bdiversao\b/, /\bdiversoes\b/,
  /\bversao\b/, /\bversoes\b/,
  /\bsalao\b/, /\bsaloes\b/,
  /\balcool\b/, // already in dict
  /\badmiracao\b/,
  /\batribuicao\b/,
  /\bnacao\b/, /\bnacoes\b/,
  /\bligacao\b/, /\bligacoes\b/,
  /\btraducao\b/, /\btraducoes\b/,
  /\bemocao\b/, // in dict
];

const DE_STILL_STRIPPED = [
  /\bfuehrt\b/, /\bfuehr\w+/,
  /\bausdrucklich\b/,
  /\bueblich/,
  /\bkuerz\w+/,
  /\bdruecken?\b/,
  /\bgluecklich\w*/,
  /\bGruesse\w*/, /\bgruesse\w*/,
  /\bkuenstlich\w*/,
  /\bMaenner\b/, /\bmaenner\b/,
  /\bHaende\b/, /\bhaende\b/,
  /\bAepfel\b/, /\baepfel\b/,
  /\bMuehe\b/, /\bmuehe\b/,
];

(async () => {
  const { data: flagsRaw } = await supabase.from('post_translations').select('id').limit(0);
  const flagsFile = JSON.parse(readFileSync('data/post-flags.json', 'utf8').replace(/^\x00/, ''));
  // actually use the snapshot from restore preview
  const preview = JSON.parse(readFileSync('data/post-restore-preview.json', 'utf8'));
  const ids: string[] = preview.map((p: any) => p.id);

  const { data } = await supabase.from('post_translations').select('*').in('id', ids);

  const remaining: Array<{ id: string; locale: string; title: string; issues: Map<string, number> }> = [];
  for (const r of data ?? []) {
    const body = r.body ?? '';
    const dict = r.locale === 'fr' ? FR_STILL_STRIPPED : r.locale === 'de' ? DE_STILL_STRIPPED : r.locale === 'pt' ? PT_STILL_STRIPPED : [];
    const issues = new Map<string, number>();
    for (const re of dict) {
      const matches = body.match(new RegExp(re.source, 'g'));
      if (matches) {
        for (const m of matches) issues.set(m, (issues.get(m) ?? 0) + 1);
      }
    }
    if (issues.size > 0) remaining.push({ id: r.id, locale: r.locale, title: r.title ?? '', issues });
  }

  console.log(`${remaining.length} posts still have stripped words:\n`);
  for (const r of remaining) {
    const top = [...r.issues.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
    console.log(`  [${r.locale}] ${r.title}`);
    console.log(`    ${top.map(([w, n]) => `${w}(${n})`).join(', ')}`);
  }
})();
