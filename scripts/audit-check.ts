import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

(async () => {
  const all: any[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('id, locale, title, description')
      .in('locale', ['fr', 'es', 'de', 'pt'])
      .range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const data = all;
  console.log(`fetched ${data.length} rows`);

  for (const r of data ?? []) {
    const text = `${r.title ?? ''} ${r.description ?? ''}`;
    if (/\bcookie dough\b/i.test(text)) {
      console.log(`COOKIE_DOUGH ${r.locale} ${r.id}`);
      console.log(`  title: ${r.title}`);
      console.log(`  desc:  ${r.description}`);
    }
    if (/\bmarshmallow fluff\b/i.test(text)) {
      console.log(`MARSHMALLOW_FLUFF ${r.locale} ${r.id}`);
      console.log(`  title: ${r.title}`);
      console.log(`  desc:  ${r.description}`);
    }
  }
})();
