/**
 * Third pass: specific words noticed in rendered output.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const apply = process.argv.includes('--apply');

type Dict = Array<[RegExp, string | ((m: string) => string)]>;

const FR3: Dict = [
  // Final -é missing on common nouns
  [/\bbeaute\b/g, 'beauté'], [/\bBeaute\b/g, 'Beauté'], [/\bbeautes\b/g, 'beautés'],
  [/\bqualite\b/g, 'qualité'], [/\bQualite\b/g, 'Qualité'], [/\bqualites\b/g, 'qualités'],
  [/\bspecialite\b/g, 'spécialité'], [/\bspecialites\b/g, 'spécialités'],
  [/\brealite\b/g, 'réalité'], [/\brealites\b/g, 'réalités'],
  [/\bsociete\b/g, 'société'], [/\bsocietes\b/g, 'sociétés'], [/\bSociete\b/g, 'Société'],
  [/\bsecurite\b/g, 'sécurité'], [/\bSecurite\b/g, 'Sécurité'],
  [/\bactivite\b/g, 'activité'], [/\bactivites\b/g, 'activités'],
  [/\bidentite\b/g, 'identité'], [/\bIdentite\b/g, 'Identité'],
  [/\buniversite\b/g, 'université'], [/\bUniversite\b/g, 'Université'],
  [/\bliberte\b/g, 'liberté'], [/\bLiberte\b/g, 'Liberté'],
  [/\bsante\b/g, 'santé'], [/\bSante\b/g, 'Santé'],
  [/\bcharite\b/g, 'charité'], [/\bCharite\b/g, 'Charité'],
  [/\bfidelite\b/g, 'fidélité'],
  [/\bgenerosite\b/g, 'générosité'],
  [/\bnouveaute\b/g, 'nouveauté'], [/\bnouveautes\b/g, 'nouveautés'],
  [/\bpropriete\b/g, 'propriété'], [/\bproprietes\b/g, 'propriétés'],
  [/\bchaleur\b/g, 'chaleur'], // correct
  [/\bchaleureux\b/g, 'chaleureux'], // correct
  // Starting é-
  [/\bequipe\b/g, 'équipe'], [/\bequipes\b/g, 'équipes'], [/\bEquipe\b/g, 'Équipe'],
  [/\belectriqu/g, 'électriqu'], [/\bElectriqu/g, 'Électriqu'],
  [/\belectrique\b/g, 'électrique'], [/\belectriques\b/g, 'électriques'],
  [/\becole\b/g, 'école'], [/\becoles\b/g, 'écoles'], [/\bEcole\b/g, 'École'],
  [/\becrit\b/g, 'écrit'], [/\becrire\b/g, 'écrire'], [/\becriture\b/g, 'écriture'],
  [/\beconomique\b/g, 'économique'], [/\beconomiques\b/g, 'économiques'],
  [/\betoile\b/g, 'étoile'], [/\betoiles\b/g, 'étoiles'],
  [/\betudier\b/g, 'étudier'], [/\betudiant\b/g, 'étudiant'], [/\betudiants\b/g, 'étudiants'],
  [/\bennuyeux\b/g, 'ennuyeux'], // correct
  [/\bsimplicite\b/g, 'simplicité'],
  [/\bpossibilite\b/g, 'possibilité'], [/\bpossibilites\b/g, 'possibilités'],
  [/\boperation\b/g, 'opération'],
  [/\bpopulation\b/g, 'population'],
  [/\bposition\b/g, 'position'], // correct (FR)
  [/\bextreme\b/g, 'extrême'], [/\bextremement\b/g, 'extrêmement'],
  [/\bsystem/g, 'systèm'],
  [/\btheme\b/g, 'thème'], [/\bthemes\b/g, 'thèmes'],
  [/\bpoeme\b/g, 'poème'],
  [/\bexperiment\w*/g, (m) => m.replace('experiment', 'expériment')],
  [/\bimportante\b/g, 'importante'], // correct
  // Miscellaneous
  [/\bnoel\b/g, 'Noël'], [/\bNoel\b/g, 'Noël'],
  [/\bspherique\b/g, 'sphérique'],
  [/\btelephon/g, 'téléphon'], [/\bTelephon/g, 'Téléphon'],
  [/\bsept\b/g, 'sept'], // correct
];

const DE3: Dict = [
  [/\bdaempfen\b/g, 'dämpfen'], [/\bDaempfen\b/g, 'Dämpfen'],
  [/\bdaempft\b/g, 'dämpft'],
  [/\bfuellt\b/g, 'füllt'], [/\bfuellen\b/g, 'füllen'],
  [/\bFuellt\b/g, 'Füllt'],
  [/\bGefaehr/g, 'Gefähr'], [/\bgefaehr/g, 'gefähr'],
  [/\bHaelft/g, 'Hälft'], [/\bhaelft/g, 'hälft'],
  [/\bHaelfte\b/g, 'Hälfte'], [/\bhaelfte\b/g, 'hälfte'],
  [/\bverfuegbar/g, 'verfügbar'], [/\bVerfuegbar/g, 'Verfügbar'],
  [/\bbenoetig/g, 'benötig'], [/\bBenoetig/g, 'Benötig'],
  [/\bbevorzug/g, 'bevorzug'], // correct
  [/\btaeglich/g, 'täglich'], [/\bTaeglich/g, 'Täglich'],
  [/\bnaehr/g, 'nähr'], [/\bNaehr/g, 'Nähr'],
  [/\bqualitaet/g, 'qualität'], [/\bQualitaet/g, 'Qualität'],
  [/\baktivitaet/g, 'aktivität'], [/\bAktivitaet/g, 'Aktivität'],
  [/\buniversitaet/g, 'universität'], [/\bUniversitaet/g, 'Universität'],
  [/\beaeu\w*/g, (m) => m.replace('eaeu', 'eäu')],
  [/\baeu\w*/g, (m) => m.replace('aeu', 'äu')],
  [/\bAeu\w*/g, (m) => m.replace('Aeu', 'Äu')],
  [/\bfruehstueck/g, 'frühstück'], [/\bFruehstueck/g, 'Frühstück'],
  [/\bspaeter/g, 'später'], [/\bSpaeter/g, 'Später'],
  [/\bfruehe?r?\b/g, (m) => m.replace('frueh', 'früh')],
  [/\bFruehe?r?\b/g, (m) => m.replace('Frueh', 'Früh')],
  [/\bbeaufstueck\w*/g, (m) => m], // placeholder
  [/\boffenbar\b/g, 'offenbar'], // correct
  [/\bgrundsaetzlich/g, 'grundsätzlich'],
  [/\btaetsaechlich/g, 'tatsächlich'], [/\btatsaechlich/g, 'tatsächlich'],
  [/\bveraendern/g, 'verändern'], [/\bverandern/g, 'verändern'],
  [/\bveraend/g, 'veränd'],
  [/\bhoer\w*/g, (m) => m.replace('hoer', 'hör')],
  [/\bHoer\w*/g, (m) => m.replace('Hoer', 'Hör')],
  [/\berhoeht/g, 'erhöht'], [/\bErhoeht/g, 'Erhöht'],
  [/\bloesen\b/g, 'lösen'], [/\bgeloest/g, 'gelöst'],
  [/\bloesch/g, 'lösch'],
];

const PT3: Dict = [
  // Paroxytone words (stress on penultimate syllable) ending in -ia, -io often need accent
  [/\benergia\b/g, 'energia'], // correct (oxytone-ish)
  [/\bfilosofia\b/g, 'filosofia'], // correct (no accent)
  [/\bgeografia\b/g, 'geografia'], // correct
  // Specific common words
  [/\bcomercio\b/g, 'comércio'], [/\bComercio\b/g, 'Comércio'],
  [/\bexpediente\b/g, 'expediente'], // correct
  [/\bconsideracao\b/g, 'consideração'], // covered by blanket
  [/\bprincipio\b/g, 'princípio'], [/\bPrincipio\b/g, 'Princípio'],
  [/\bprincipios\b/g, 'princípios'],
  [/\bservico\b/g, 'serviço'], [/\bServico\b/g, 'Serviço'],
  [/\bservicos\b/g, 'serviços'], [/\bServicos\b/g, 'Serviços'],
  [/\bsao\b/g, 'são'], [/\bSao\b/g, 'São'],
  // Past participles with -ída, -ído
  [/\bcontribuicao\b/g, 'contribuição'],
  [/\bdistribuicao\b/g, 'distribuição'],
  [/\bsubstituicao\b/g, 'substituição'],
  [/\bconstituicao\b/g, 'constituição'],
  // Common proparoxytones
  [/\bmetodo\b/g, 'método'], [/\bmetodos\b/g, 'métodos'],
  [/\bMetodo\b/g, 'Método'],
  [/\bpublico\b/g, 'público'], [/\bPublico\b/g, 'Público'],
  [/\bpublica\b/g, 'pública'], [/\bpublicos\b/g, 'públicos'],
  [/\btropico\b/g, 'trópico'], [/\btropicos\b/g, 'trópicos'],
  [/\boptimo\b/g, 'ótimo'], [/\botimo\b/g, 'ótimo'], [/\bOtimo\b/g, 'Ótimo'],
  [/\botima\b/g, 'ótima'], [/\bOtima\b/g, 'Ótima'],
  [/\botimos\b/g, 'ótimos'],
  [/\botimas\b/g, 'ótimas'],
  [/\bmaximo\b/g, 'máximo'], [/\bMaximo\b/g, 'Máximo'],
  [/\bmaxima\b/g, 'máxima'], [/\bminimo\b/g, 'mínimo'],
  [/\bminima\b/g, 'mínima'],
  [/\butil\b/g, 'útil'], [/\bUtil\b/g, 'Útil'],
  [/\buteis\b/g, 'úteis'],
  [/\bidentico\b/g, 'idêntico'], [/\bidentica\b/g, 'idêntica'],
  [/\bautentico\b/g, 'autêntico'], [/\bautentica\b/g, 'autêntica'],
  [/\bromantico\b/g, 'romântico'], [/\bromantica\b/g, 'romântica'],
  [/\bdomestico\b/g, 'doméstico'], [/\bdomestica\b/g, 'doméstica'],
  [/\bdomesticos\b/g, 'domésticos'],
  [/\bidiomatico\b/g, 'idiomático'], [/\bdiplomatico\b/g, 'diplomático'],
  [/\blogica\b/g, 'lógica'], [/\blogico\b/g, 'lógico'], [/\bLogica\b/g, 'Lógica'],
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
    const dict = r.locale === 'fr' ? FR3 : r.locale === 'de' ? DE3 : r.locale === 'pt' ? PT3 : null;
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
  console.log(`${apply ? 'Applied' : 'Would apply'} pass3 to ${changed} posts.`);
})();
