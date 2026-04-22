import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

(async () => {
  const { data: sample } = await supabase.from('posts').select('*').limit(1);
  console.log('posts columns:', Object.keys(sample?.[0] ?? {}));

  const { data: all } = await supabase.from('posts').select('*').order('published_at', { ascending: true });
  if (!all) return;

  const drafts = all.filter(p => p.status === 'draft');
  const published = all.filter(p => p.status === 'published');
  console.log(`\nTotal posts: ${all.length}`);
  console.log(`  Published: ${published.length}`);
  console.log(`  Drafts: ${drafts.length}`);

  // Check if posts has body_en/content_en/body/content
  const cols = Object.keys(sample?.[0] ?? {});
  const bodyCol = cols.find(c => c === 'body_en' || c === 'body' || c === 'content_en' || c === 'content');
  console.log(`\nBody column on posts: ${bodyCol ?? '(none found)'}`);

  if (bodyCol) {
    const wc = (p: any) => ((p[bodyCol] ?? '') as string).split(/\s+/).filter(Boolean).length;
    const draftWC = drafts.map(d => ({ slug: d.slug, wc: wc(d) }));
    const buckets = {
      empty: draftWC.filter(b => b.wc === 0).length,
      under200: draftWC.filter(b => b.wc > 0 && b.wc < 200).length,
      under500: draftWC.filter(b => b.wc >= 200 && b.wc < 500).length,
      under1000: draftWC.filter(b => b.wc >= 500 && b.wc < 1000).length,
      atLeast1000: draftWC.filter(b => b.wc >= 1000).length,
    };
    console.log('\nEnglish body word-count buckets for DRAFTS:');
    console.log(`  0 words:         ${buckets.empty}`);
    console.log(`  1-199:           ${buckets.under200}`);
    console.log(`  200-499:         ${buckets.under500}`);
    console.log(`  500-999:         ${buckets.under1000}`);
    console.log(`  1000+:           ${buckets.atLeast1000}`);
    const pubWC = published.map(d => ({ slug: d.slug, wc: wc(d) }));
    console.log('\nFor PUBLISHED:');
    console.log(`  min/median/max: ${Math.min(...pubWC.map(p => p.wc))} / ${pubWC.map(p => p.wc).sort((a,b)=>a-b)[Math.floor(pubWC.length/2)]} / ${Math.max(...pubWC.map(p => p.wc))}`);
  }
})();
