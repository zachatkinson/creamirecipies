import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const LOCALES = ['fr', 'es', 'de', 'pt'];

function wc(s: string | null | undefined): number {
  return (s ?? '').split(/\s+/).filter(Boolean).length;
}

// Acceptable ratios (translated_wc / en_wc): FR ~90-100%, ES ~85-95%, DE ~70-80%, PT ~85-95%
const MIN_RATIO: Record<string, number> = { fr: 0.85, es: 0.80, de: 0.65, pt: 0.80 };

(async () => {
  const { data: posts } = await supabase.from('posts').select('id, slug, status, body');
  if (!posts) return;
  const enWC = new Map(posts.map(p => [p.id as string, wc(p.body as string)]));
  const statusById = new Map(posts.map(p => [p.id as string, p.status as string]));
  const slugById = new Map(posts.map(p => [p.id as string, p.slug as string]));

  const { data: trans } = await supabase.from('post_translations').select('post_id, locale, title, body');
  if (!trans) return;

  type Row = { post_id: string; locale: string; title: string | null; body: string | null };
  const byPostLocale = new Map<string, Row>();
  for (const r of trans as Row[]) byPostLocale.set(`${r.post_id}__${r.locale}`, r);

  const missing: Array<{ post_id: string; slug: string; locale: string; status: string }> = [];
  const tooShort: Array<{ post_id: string; slug: string; locale: string; status: string; enWC: number; trWC: number; ratio: number }> = [];
  const ok: Array<{ post_id: string; slug: string; locale: string }> = [];

  for (const p of posts) {
    const enCount = enWC.get(p.id as string) ?? 0;
    if (enCount === 0) continue;
    for (const loc of LOCALES) {
      const row = byPostLocale.get(`${p.id}__${loc}`);
      if (!row || !row.body || row.body.trim().length === 0) {
        missing.push({ post_id: p.id as string, slug: p.slug as string, locale: loc, status: p.status as string });
        continue;
      }
      const trCount = wc(row.body);
      const ratio = trCount / enCount;
      if (ratio < MIN_RATIO[loc]) {
        tooShort.push({ post_id: p.id as string, slug: p.slug as string, locale: loc, status: p.status as string, enWC: enCount, trWC: trCount, ratio });
      } else {
        ok.push({ post_id: p.id as string, slug: p.slug as string, locale: loc });
      }
    }
  }

  console.log(`Posts with EN body: ${posts.filter(p => (enWC.get(p.id as string) ?? 0) > 0).length}`);
  console.log(`  Published: ${posts.filter(p => p.status === 'published').length}`);
  console.log(`  Drafts:    ${posts.filter(p => p.status === 'draft').length}`);

  console.log(`\nTranslation coverage summary (ratio thresholds fr:0.85 es:0.80 de:0.65 pt:0.80):`);
  console.log(`  Clean translations:   ${ok.length}`);
  console.log(`  Missing entirely:     ${missing.length}`);
  console.log(`  Too short (summary):  ${tooShort.length}`);

  console.log(`\nMissing by locale:`);
  for (const loc of LOCALES) {
    const pub = missing.filter(m => m.locale === loc && m.status === 'published').length;
    const drf = missing.filter(m => m.locale === loc && m.status === 'draft').length;
    console.log(`  ${loc}: ${pub + drf} (published=${pub}, draft=${drf})`);
  }

  console.log(`\nToo-short by locale:`);
  for (const loc of LOCALES) {
    const pub = tooShort.filter(m => m.locale === loc && m.status === 'published').length;
    const drf = tooShort.filter(m => m.locale === loc && m.status === 'draft').length;
    console.log(`  ${loc}: ${pub + drf} (published=${pub}, draft=${drf})`);
  }

  // Show all missing + too-short for published posts specifically (most urgent)
  const pubMissing = missing.filter(m => m.status === 'published');
  const pubShort = tooShort.filter(m => m.status === 'published');
  if (pubMissing.length + pubShort.length > 0) {
    console.log(`\n--- PUBLISHED posts with translation issues ---`);
    const bySlug = new Map<string, { missing: string[]; short: Array<{locale:string;ratio:number}> }>();
    for (const m of pubMissing) {
      if (!bySlug.has(m.slug)) bySlug.set(m.slug, { missing: [], short: [] });
      bySlug.get(m.slug)!.missing.push(m.locale);
    }
    for (const s of pubShort) {
      if (!bySlug.has(s.slug)) bySlug.set(s.slug, { missing: [], short: [] });
      bySlug.get(s.slug)!.short.push({ locale: s.locale, ratio: s.ratio });
    }
    for (const [slug, info] of bySlug) {
      const missStr = info.missing.length ? `MISSING: ${info.missing.join(',')}` : '';
      const shortStr = info.short.length ? `SHORT: ${info.short.map(s => `${s.locale}(${(s.ratio*100).toFixed(0)}%)`).join(',')}` : '';
      console.log(`  ${slug} — ${[missStr, shortStr].filter(Boolean).join('  ')}`);
    }
  }

  // Summarize drafts
  const draftPostsWithIssues = new Set<string>();
  for (const m of missing) if (m.status === 'draft') draftPostsWithIssues.add(m.post_id);
  for (const s of tooShort) if (s.status === 'draft') draftPostsWithIssues.add(s.post_id);
  console.log(`\nDraft posts with any translation issue: ${draftPostsWithIssues.size}`);
})();
