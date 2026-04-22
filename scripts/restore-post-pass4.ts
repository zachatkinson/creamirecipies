/**
 * Fourth pass: residuals observed in rendered samples.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const apply = process.argv.includes('--apply');

type Dict = Array<[RegExp, string | ((m: string) => string)]>;

const FR4: Dict = [
  [/\betre\b/g, 'être'], [/\bEtre\b/g, 'Être'],
  [/\bpeut-etre\b/g, 'peut-être'], [/\bPeut-etre\b/g, 'Peut-être'],
  [/\bcongelateur\b/g, 'congélateur'], [/\bCongelateur\b/g, 'Congélateur'],
  [/\bcongela\b/g, 'congéla'], [/\bcongelation\b/g, 'congélation'],
  [/\bsurgele\b/g, 'surgelé'], [/\bsurgelee\b/g, 'surgelée'],
  [/\breseau\b/g, 'réseau'], [/\breseaux\b/g, 'réseaux'],
  // Past participles ending in "e" (probably "é")
  [/\bpense\b/g, 'pensé'], [/\bpensee\b/g, 'pensée'],
  [/\bemballe\b/g, 'emballé'], [/\bemballes\b/g, 'emballés'],
  [/\bemballee\b/g, 'emballée'],
  [/\bfavorise\b/g, 'favorisé'], [/\bfavorisee\b/g, 'favorisée'],
  [/\blivre\b/g, 'livre'], // ambiguous (book vs delivered) — skip
  [/\bdepose\b/g, 'déposé'], [/\bdeposee\b/g, 'déposée'],
  [/\bcoupe\b/g, 'coupé'], // ambiguous
  [/\bpartage\b/g, 'partagé'], // ambiguous
  [/\barrange\b/g, 'arrangé'], // ambiguous
  // Non-ambiguous starting-é
  [/\bevidenc/g, 'évidenc'], [/\bEvidenc/g, 'Évidenc'],
  [/\bevolu/g, 'évolu'],
  [/\betudie/g, 'étudié'], [/\betudier\b/g, 'étudier'],
  // -iere endings
  [/\bmaniere\b/g, 'manière'], [/\bManiere\b/g, 'Manière'],
  [/\bmanieres\b/g, 'manières'],
  [/\bepoque\b/g, 'époque'], [/\bEpoque\b/g, 'Époque'],
  [/\bepoques\b/g, 'époques'],
  [/\bequilibr/g, 'équilibr'], [/\bEquilibr/g, 'Équilibr'],
  // Ate/été nouns
  [/\bduree\b/g, 'durée'], [/\bDuree\b/g, 'Durée'],
  [/\bpuree\b/g, 'purée'], [/\bPuree\b/g, 'Purée'],
  [/\bsoirees?\b/g, (m) => m.replace('soiree', 'soirée')],
  [/\bfiance\b/g, 'fiancé'], [/\bfiancee\b/g, 'fiancée'],
  // Misc
  [/\bvega\w+/g, (m) => m.startsWith('vegan') ? m : m.replace('vega', 'végé')],
  [/\bvegetar/g, 'végétar'], [/\bvegetarien/g, 'végétarien'],
  [/\bzero\b/g, 'zéro'],
];

const DE4: Dict = [
  [/\bmuessen\b/g, 'müssen'], [/\bmuss\b/g, 'muss'], // correct
  [/\bmuesst\w*/g, (m) => m.replace('muesst', 'müsst')],
  [/\bmuesse\b/g, 'müsse'],
  [/\bwuenschen\b/g, 'wünschen'], [/\bwunsch\b/g, 'wunsch'],
  [/\bWuensch\w*/g, (m) => m.replace('Wuensch', 'Wünsch')],
  [/\bwuensch\w*/g, (m) => m.replace('wuensch', 'wünsch')],
  [/\bduer\w+/g, (m) => m.replace('duer', 'dür')],
  [/\bDuer\w+/g, (m) => m.replace('Duer', 'Dür')],
  [/\btuer\b/g, 'tür'], // ambiguous with infinitive "tuer" = to kill (French!) — safe in DE
  [/\bTuer\b/g, 'Tür'],
  [/\bTueren\b/g, 'Türen'],
  [/\bgenuegen\b/g, 'genügen'], [/\bgenuegend\b/g, 'genügend'],
  [/\buebermae/g, 'übermä'],
  [/\buebergeh/g, 'übergeh'],
  [/\buebertrag/g, 'übertrag'],
  [/\buebersicht/g, 'übersicht'],
  [/\buebergang/g, 'übergang'],
  [/\buebrig/g, 'übrig'],
  [/\boekologisch/g, 'ökologisch'],
  [/\boekonomisch/g, 'ökonomisch'],
  [/\bverfuehrer/g, 'verführer'],
  [/\bGefuehl\w*/g, (m) => m.replace('Gefuehl', 'Gefühl')],
  [/\bgefuehl\w*/g, (m) => m.replace('gefuehl', 'gefühl')],
  [/\bbevoelker/g, 'bevölker'],
  [/\bPhaeno/g, 'Phäno'],
  [/\bfaehig/g, 'fähig'], [/\bFaehig/g, 'Fähig'],
  [/\bLaeng/g, 'Läng'], [/\blaeng/g, 'läng'],
  [/\bTaetigkeit/g, 'Tätigkeit'], [/\btaetigkeit/g, 'tätigkeit'],
];

const PT4: Dict = [
  // paroxytones ending in -vel
  [/\badoravel\b/g, 'adorável'], [/\bAdoravel\b/g, 'Adorável'],
  [/\bnotavel\b/g, 'notável'], [/\bNotavel\b/g, 'Notável'],
  [/\bnivel\b/g, 'nível'], // in dict
  [/\binoxidavel\b/g, 'inoxidável'],
  [/\baceitavel\b/g, 'aceitável'],
  [/\btraduzivel\b/g, 'traduzível'],
  // Compound accented
  [/\bprincipalmente\b/g, 'principalmente'], // correct
  [/\bdiariamente\b/g, 'diariamente'], // correct
  [/\bsomente\b/g, 'somente'], // correct
  // Common
  [/\bsolido\b/g, 'sólido'], [/\bSolido\b/g, 'Sólido'],
  [/\bliquido\b/g, 'líquido'], [/\bLiquido\b/g, 'Líquido'],
  [/\bseculo\b/g, 'século'], [/\bSeculo\b/g, 'Século'],
  [/\bmusica\b/g, 'música'], [/\bMusica\b/g, 'Música'],
  [/\bmusicas\b/g, 'músicas'],
  [/\bhospital\b/g, 'hospital'], // correct
  [/\bpessoa\b/g, 'pessoa'], // correct
  [/\bdinamico\b/g, 'dinâmico'], [/\bdinamica\b/g, 'dinâmica'],
  [/\bplastico\b/g, 'plástico'], [/\bplastica\b/g, 'plástica'],
  [/\btecnica\b/g, 'técnica'], [/\btecnicas\b/g, 'técnicas'],
  [/\btecnico\b/g, 'técnico'], [/\btecnicos\b/g, 'técnicos'],
];

type PostRow = { id: string; locale: string; title: string | null; excerpt: string | null; body: string | null };

function restore(text: string | null, dict: Dict): string | null {
  if (!text) return text;
  let out = text;
  for (const [re, rep] of dict) {
    if (typeof rep === 'function') out = out.replace(re, rep as any);
    else out = out.replace(re, rep);
  }
  return out;
}

(async () => {
  const preview = JSON.parse(readFileSync('data/post-restore-preview.json', 'utf8'));
  const ids: string[] = preview.map((p: any) => p.id);
  const { data } = await supabase.from('post_translations').select('*').in('id', ids);

  let changed = 0;
  for (const r of (data ?? []) as PostRow[]) {
    const dict = r.locale === 'fr' ? FR4 : r.locale === 'de' ? DE4 : r.locale === 'pt' ? PT4 : null;
    if (!dict) continue;
    const newTitle = restore(r.title, dict);
    const newExcerpt = restore(r.excerpt, dict);
    const newBody = restore(r.body, dict);
    if (newTitle === r.title && newExcerpt === r.excerpt && newBody === r.body) continue;
    changed++;
    if (apply) {
      const update: any = {};
      if (newTitle !== r.title) update.title = newTitle;
      if (newExcerpt !== r.excerpt) update.excerpt = newExcerpt;
      if (newBody !== r.body) update.body = newBody;
      const { error } = await supabase.from('post_translations').update(update).eq('id', r.id);
      if (error) console.log(`ERR ${r.id}: ${error.message}`);
    }
  }
  console.log(`${apply ? 'Applied' : 'Would apply'} pass4 to ${changed} posts.`);
})();
