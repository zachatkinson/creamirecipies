/**
 * Second pass: catches words missed by the first dictionary.
 *   - PT: blanket -cao→-ção and -coes→-ções rules (safe because there are no
 *     modern Portuguese words that end in unaccented "cao"/"coes" as a valid
 *     standalone form).
 *   - Specific missed words per locale.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const apply = process.argv.includes('--apply');

type Dict = Array<[RegExp, string | ((m: string) => string)]>;

const FR2: Dict = [
  [/\bdebut\b/g, 'début'], [/\bDebut\b/g, 'Début'],
  [/\bdebuts\b/g, 'débuts'],
  [/\bdebuter\b/g, 'débuter'], [/\bdebute\b/g, 'débute'], [/\bdebutent\b/g, 'débutent'],
  [/\bameliorer\b/g, 'améliorer'], [/\bameliore\b/g, 'améliore'],
  [/\bamelior/g, 'améliore'], // covers améliore/amélioration compound
  [/\bamelioration\b/g, 'amélioration'], [/\bameliorations\b/g, 'améliorations'],
  [/\bcoute\b/g, 'coûte'], [/\bcoutent\b/g, 'coûtent'], [/\bcouter\b/g, 'coûter'],
  [/\bverifier\b/g, 'vérifier'], [/\bverifi\w+/g, (m) => m.replace('verifi', 'vérifi')],
  [/\bexperience\b/g, 'expérience'], [/\bexperiences\b/g, 'expériences'],
  [/\bExperience\b/g, 'Expérience'], [/\bExperiences\b/g, 'Expériences'],
  [/\barriere\b/g, 'arrière'], [/\barrieres\b/g, 'arrières'],
  [/\bArriere\b/g, 'Arrière'],
  [/\bregle\b/g, 'règle'], [/\bregles\b/g, 'règles'], [/\bRegle\b/g, 'Règle'],
  [/\bresume\b/g, 'résumé'], [/\bresumer\b/g, 'résumer'], [/\bresumes\b/g, 'résumés'],
  [/\bnumer/g, 'numér'],
  [/\btele\w+/g, (m) => 'télé' + m.slice(4)], // télévision, téléphone, etc.
  [/\bTele\w+/g, (m) => 'Télé' + m.slice(4)],
  [/\bcorrect\w+/g, (m) => m], // correct as-is
  [/\bsouvenir\b/g, 'souvenir'], // correct as-is
  [/\bsouvent\b/g, 'souvent'], // correct as-is
];

const DE2: Dict = [
  [/\bfuehrt\b/g, 'führt'], [/\bfuehren\b/g, 'führen'],
  [/\bfuehr\w+/g, (m) => m.replace('fuehr', 'führ')],
  [/\bFuehr\w+/g, (m) => m.replace('Fuehr', 'Führ')],
  [/\bMuehe\b/g, 'Mühe'], [/\bmuehe\b/g, 'mühe'],
  [/\bdruecken\b/g, 'drücken'], [/\bDruecken\b/g, 'Drücken'],
  [/\bdrueckt\b/g, 'drückt'],
  [/\bHaende\b/g, 'Hände'], [/\bhaende\b/g, 'hände'],
  [/\bAepfel\b/g, 'Äpfel'], [/\baepfel\b/g, 'äpfel'],
  [/\bMaenner\b/g, 'Männer'], [/\bmaenner\b/g, 'männer'],
  [/\bkuenstlich\w*/g, (m) => m.replace('kuenstlich', 'künstlich')],
  [/\bKuenstlich\w*/g, (m) => m.replace('Kuenstlich', 'Künstlich')],
];

const PT2: Dict = [
  // Blanket -cao → -ção
  [/([a-z]{3,})cao\b/g, '$1ção'],
  [/([A-Z][a-z]{2,})cao\b/g, '$1ção'],
  [/([a-z]{3,})coes\b/g, '$1ções'],
  [/([A-Z][a-z]{2,})coes\b/g, '$1ções'],
  // Specific words
  [/\bja\b/g, 'já'], [/\bJa\b/g, 'Já'],
  [/\bfamilia\b/g, 'família'], [/\bfamilias\b/g, 'famílias'],
  [/\bFamilia\b/g, 'Família'], [/\bFamilias\b/g, 'Famílias'],
  [/\bhistoria\b/g, 'história'], [/\bhistorias\b/g, 'histórias'],
  [/\bHistoria\b/g, 'História'], [/\bHistorias\b/g, 'Histórias'],
  [/\bculinaria\b/g, 'culinária'], [/\bCulinaria\b/g, 'Culinária'],
  [/\bmemoria\b/g, 'memória'], [/\bmemorias\b/g, 'memórias'],
  [/\bMemoria\b/g, 'Memória'],
  [/\bcriancas\b/g, 'crianças'], [/\bCriancas\b/g, 'Crianças'],
  [/\bcrianca\b/g, 'criança'], [/\bCrianca\b/g, 'Criança'],
  [/\bvoce\b/g, 'você'], [/\bVoce\b/g, 'Você'],
  [/\bvoces\b/g, 'vocês'], [/\bVoces\b/g, 'Vocês'],
  [/\bpreciacao\b/g, 'preciação'], [/\bPreciacao\b/g, 'Preciação'],
  [/\bomparacao\b/g, 'omparação'],
  [/\bestacao\b/g, 'estação'], [/\bestacoes\b/g, 'estações'],
  [/\binicio\b/g, 'início'], [/\bInicio\b/g, 'Início'],
  [/\bmassa\b/g, 'massa'], // correct
  [/\bmateria\b/g, 'matéria'], [/\bmaterias\b/g, 'matérias'],
  [/\barea\b/g, 'área'], [/\bareas\b/g, 'áreas'], [/\bArea\b/g, 'Área'],
  [/\bnumero\b/g, 'número'], [/\bnumeros\b/g, 'números'],
  [/\bNumero\b/g, 'Número'],
  [/\boficial\b/g, 'oficial'], // correct
  [/\bcomercio\b/g, 'comércio'], [/\bComercio\b/g, 'Comércio'],
  [/\bvariacao\b/g, 'variação'], [/\bvariacoes\b/g, 'variações'],
  [/\bversao\b/g, 'versão'], [/\bversoes\b/g, 'versões'],
  [/\bVersao\b/g, 'Versão'], [/\bVersoes\b/g, 'Versões'],
  [/\brazao\b/g, 'razão'], [/\brazoes\b/g, 'razões'],
  [/\bRazao\b/g, 'Razão'],
  [/\bnacao\b/g, 'nação'], [/\bnacoes\b/g, 'nações'],
];

type PostRow = { id: string; post_id: string; locale: string; title: string | null; excerpt: string | null; body: string | null };

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

  const summary: any[] = [];
  for (const r of (data ?? []) as PostRow[]) {
    const dict = r.locale === 'fr' ? FR2 : r.locale === 'de' ? DE2 : r.locale === 'pt' ? PT2 : null;
    if (!dict) continue;
    const newTitle = restore(r.title, dict);
    const newExcerpt = restore(r.excerpt, dict);
    const newBody = restore(r.body, dict);
    if (newTitle === r.title && newExcerpt === r.excerpt && newBody === r.body) continue;
    const diff = countDiff(r.body ?? '', newBody ?? '');
    summary.push({ id: r.id, locale: r.locale, title: r.title, diff });
    if (apply) {
      const update: any = {};
      if (newTitle !== r.title) update.title = newTitle;
      if (newExcerpt !== r.excerpt) update.excerpt = newExcerpt;
      if (newBody !== r.body) update.body = newBody;
      const { error } = await supabase.from('post_translations').update(update).eq('id', r.id);
      if (error) console.log(`ERR ${r.id}: ${error.message}`);
    }
  }
  console.log(`${apply ? 'Applied' : 'Would apply'} pass2 to ${summary.length} posts:`);
  for (const s of summary.sort((a, b) => b.diff - a.diff)) {
    console.log(`  [${s.locale}] ${s.diff} chars  ${s.title}`);
  }
})();

function countDiff(a: string, b: string): number {
  let n = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) if (a[i] !== b[i]) n++;
  n += Math.abs(a.length - b.length);
  return n;
}
