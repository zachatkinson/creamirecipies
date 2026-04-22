import { readFileSync } from 'fs';
import { globSync } from 'fs';
import { readdirSync } from 'fs';

const SLUGS = readdirSync('data/spot-check').filter(f => f.endsWith('.json')).map(f => f.replace('.json','')).sort();

interface LocaleInfo {
  wc: number;
  paras: number;
  title: string;
  excerpt: string;
  body: string;
}

// Stripped-diacritic patterns per locale
const DIACRITIC_PATTERNS: Record<string, RegExp[]> = {
  fr: [
    /\b(difference|differences|deceptions?|experience|experiences|legerement|espece|generalement|recette|recettes|reserver|numero|numeros|apres|donnee|donnees|regulier|regulieres?|regulariter?|congelation|melanger?|melange|melanges|eviter|evidemment)\b/gi,
    /\b(a|ou|la|cote)\s+(?=[a-z])/g, // suspect missing à/où/là/côté — often OK but common failure
  ],
  de: [
    /\b(groessere?|groess|fuehrt|fuehren|ueber|ueblich|kuenstlich|Koerper|groessten?|stuecken?|Stueck|nuetzlich|uebrig|ueblich|drueckt?|Aepfel|Haende|Maenner|Waermbehandlung|staerker|staerkt|traegt?|koernig|Oeffnen|oeffnen|duennen?|zuerueck|Muehe|fuehlen|fuehlt|gefuehl|Gefuehl|Hoeher|hoeher|groesser|stuecke|verdraengt|ausgefuehrt|fuege|fuegen|Koenig|koennen|kuehler|Kueche|Buecher|verfuehr|Koelsch|naechste|grosse|grossen|ueblich|ueber)\b/gi,
    /ae(?!stu|bt|r )/g, // ae in unusual places (very rough)
    /oe(?!-|dem|sophag)/g,
    /ue(?! )/g,
  ],
  pt: [
    /\b(e|aguda|capaz|facil|agua|agora|voce|voces|numero|numeros|inicio|ultimo|ultimos?|ate|dia|dias|historia|familia|memoria|area|areas|indice|oceano|coracao|atencao|informacao|aplicacao|preparacao|operacao|duracao|adicao|solucao|direcao|porcao|porcoes|funcao|funcoes|opcao|opcoes|razao|razoes|nacao|nacoes|estacao|estacoes|producao|selecao|protecao|posicao|distincao)\b/gi,
  ],
  es: [
    /\b(maquina|maquinas|tambien|segun|aun|dia|dias|pequeno|pequenos|anadir|espana|ademas|numero|numeros|rapido|rapida|rapidos|medico|pagina|publico|agua|agua|linea|lineas|facil|faciles|cafe|cafes|proximo|proxima|ultimos?|despues|estandar|exito|ademas|carne|sin|como|acuerdo)\b/gi,
  ],
};

function countMatches(body: string, pats: RegExp[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const re of pats) {
    const matches = body.match(re) || [];
    for (const m of matches) counts.set(m.toLowerCase(), (counts.get(m.toLowerCase()) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
}

for (const slug of SLUGS) {
  const data = JSON.parse(readFileSync(`data/spot-check/${slug}.json`, 'utf8'));
  console.log(`\n================== ${slug} ==================`);
  console.log(`EN: ${data.en.wc}w, ${data.en.paras} paras`);
  for (const loc of ['fr', 'es', 'de', 'pt']) {
    const t: LocaleInfo | undefined = data.trs[loc];
    if (!t) { console.log(`  ${loc}: MISSING`); continue; }
    const ratio = (t.wc / data.en.wc * 100).toFixed(0);
    const paraDelta = t.paras - data.en.paras;
    const stripped = countMatches(t.body ?? '', DIACRITIC_PATTERNS[loc] ?? []);
    const strippedTop = stripped.slice(0, 5).map(([w, n]) => `${w}(${n})`).join(', ');
    console.log(`  ${loc}: ${t.wc}w ${ratio}%  paras ${t.paras} (Δ${paraDelta >= 0 ? '+' : ''}${paraDelta})  stripped: ${strippedTop || '(none)'}`);
  }
}
