import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Patterns to detect:
// (a) "foo## " — heading immediately following text without blank line
// (b) Short stub followed by "## Why X Matters" or similar "Why" / "Introduction" heading partway through
// (c) Duplicated heading text (same heading appears twice)

(async () => {
  const { data } = await supabase.from('posts').select('id, slug, status, body').order('published_at', { ascending: true });
  if (!data) return;

  const issues: Array<{ slug: string; status: string; problems: string[] }> = [];
  for (const p of data) {
    const body = (p.body as string) ?? '';
    const problems: string[] = [];

    // (a) Missing \n\n before heading
    const noNewlineBeforeHeading = body.match(/[a-z]##\s/g);
    if (noNewlineBeforeHeading) problems.push(`missing-newline-before-heading(${noNewlineBeforeHeading.length})`);

    // (b) Duplicated heading text (same exact heading appears twice)
    const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map(m => m[1]);
    const dupes = headings.filter((h, i) => headings.indexOf(h) !== i);
    if (dupes.length > 0) problems.push(`duplicate-heading(${[...new Set(dupes)].join('|')})`);

    // (c) Short stub: first 300 chars contain multiple ## headings (looks like summary)
    const first500 = body.slice(0, 500);
    const headingsInFirst500 = (first500.match(/^##\s+/gm) || []).length;
    if (headingsInFirst500 >= 3) problems.push(`${headingsInFirst500}-headings-in-first-500-chars`);

    if (problems.length > 0) issues.push({ slug: p.slug as string, status: p.status as string, problems });
  }

  console.log(`Found issues in ${issues.length}/${data.length} posts:\n`);
  const byStatus = { published: issues.filter(i => i.status === 'published'), draft: issues.filter(i => i.status === 'draft') };
  console.log(`Published: ${byStatus.published.length}  Drafts: ${byStatus.draft.length}\n`);
  for (const i of issues.slice(0, 40)) {
    console.log(`  [${i.status}] ${i.slug}`);
    console.log(`    ${i.problems.join(' | ')}`);
  }
  if (issues.length > 40) console.log(`  ... and ${issues.length - 40} more`);
})();
