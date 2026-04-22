/**
 * Better audit metric: paragraph-count delta per translation.
 *
 * Word-count ratio under-reports the problem because surviving paragraphs can be
 * padded while other paragraphs are dropped. Counting paragraphs catches both
 * "dropped whole paragraphs" and "compressed into bullet-list" patterns.
 */
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function paras(s: string | null | undefined): number {
  return ((s ?? '').split(/\n\n+/).filter(Boolean)).length;
}
function wc(s: string | null | undefined): number {
  return (s ?? '').split(/\s+/).filter(Boolean).length;
}

const LOCALES = ['fr','es','de','pt'] as const;

(async () => {
  const { data: posts } = await supabase.from('posts').select('id, slug, status, body');
  if (!posts) return;
  const enParas = new Map(posts.map(p => [p.id as string, paras(p.body as string)]));
  const enWC = new Map(posts.map(p => [p.id as string, wc(p.body as string)]));
  const status = new Map(posts.map(p => [p.id as string, p.status as string]));
  const slug = new Map(posts.map(p => [p.id as string, p.slug as string]));

  const { data: trs } = await supabase.from('post_translations').select('post_id, locale, body');
  if (!trs) return;

  interface Flag { post_id: string; slug: string; status: string; locale: string; enParas: number; trParas: number; paraDelta: number; wcRatio: number }
  const flags: Flag[] = [];
  const clean: Flag[] = [];
  for (const t of trs) {
    const pid = t.post_id as string;
    const loc = t.locale as string;
    if (!LOCALES.includes(loc as any)) continue;
    const ep = enParas.get(pid) ?? 0;
    const tp = paras(t.body as string);
    const ew = enWC.get(pid) ?? 0;
    const tw = wc(t.body as string);
    const ratio = ew === 0 ? 0 : tw / ew;
    const entry = { post_id: pid, slug: slug.get(pid) ?? '?', status: status.get(pid) ?? '?', locale: loc, enParas: ep, trParas: tp, paraDelta: tp - ep, wcRatio: ratio };
    if (tp < ep) flags.push(entry);
    else clean.push(entry);
  }

  console.log(`\nTranslations where paragraph count < EN paragraph count:`);
  const byLocale: Record<string, Flag[]> = {};
  for (const f of flags) { (byLocale[f.locale] ??= []).push(f); }
  for (const loc of LOCALES) {
    const list = byLocale[loc] ?? [];
    const pub = list.filter(f => f.status === 'published').length;
    const drf = list.filter(f => f.status === 'draft').length;
    console.log(`  ${loc}: ${list.length} (published=${pub}, draft=${drf})`);
  }

  // Severity buckets
  const severe = flags.filter(f => (f.enParas - f.trParas) >= 5);
  const moderate = flags.filter(f => {
    const d = f.enParas - f.trParas; return d >= 3 && d < 5;
  });
  const marginal = flags.filter(f => {
    const d = f.enParas - f.trParas; return d >= 1 && d < 3;
  });
  console.log(`\nSeverity:`);
  console.log(`  Marginal (1-2 paras short):   ${marginal.length}  — likely acceptable natural compression`);
  console.log(`  Moderate (3-4 paras short):   ${moderate.length}  — probably missing content`);
  console.log(`  Severe   (5+ paras short):    ${severe.length}  — clear summary, needs rewrite`);

  const severePosts = new Set(severe.map(f => f.post_id));
  const pubSevere = severe.filter(f => f.status === 'published').map(f => f.slug);
  console.log(`\n  Severe affects ${severePosts.size} distinct posts`);
  console.log(`  Severe-published slugs: ${[...new Set(pubSevere)].join(', ')}`);

  // How many distinct posts are affected?
  const distinctPosts = new Set(flags.map(f => f.post_id));
  const distinctByStatus = {
    published: new Set(flags.filter(f => f.status === 'published').map(f => f.post_id)).size,
    draft: new Set(flags.filter(f => f.status === 'draft').map(f => f.post_id)).size,
  };
  console.log(`\nDistinct affected posts: ${distinctPosts.size}  (published ${distinctByStatus.published}, draft ${distinctByStatus.draft})`);

  // Compare vs ratio-only flagging
  const ratioFlags = clean.filter(f => {
    const lo: Record<string, number> = { fr: 0.85, es: 0.80, de: 0.65, pt: 0.80 };
    return f.wcRatio < (lo[f.locale] ?? 0);
  });
  console.log(`\nTranslations that PASS ratio check but FAIL paragraph check:`);
  const passedRatioFailedParas = flags.filter(f => {
    const lo: Record<string, number> = { fr: 0.85, es: 0.80, de: 0.65, pt: 0.80 };
    return f.wcRatio >= (lo[f.locale] ?? 0);
  });
  console.log(`  ${passedRatioFailedParas.length} — these were missed by earlier audit`);
  const byLocPassed: Record<string, number> = {};
  for (const f of passedRatioFailedParas) byLocPassed[f.locale] = (byLocPassed[f.locale] ?? 0) + 1;
  for (const loc of LOCALES) console.log(`    ${loc}: ${byLocPassed[loc] ?? 0}`);
})();
