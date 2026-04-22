/**
 * Patch FR/DE/PT for best-creami-accessories:
 *   - Restore stripped accents in title + excerpt
 *   - Append missing "## Explore Our Collections" section to body
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const apply = process.argv.includes('--apply');

const patches: Record<string, { title: string; excerpt: string; collections: string }> = {
  fr: {
    title: "Les meilleurs accessoires Ninja Creami à acheter",
    excerpt: "Des pots supplémentaires aux balances de cuisine, découvrez les accessoires qui améliorent vraiment votre expérience Ninja Creami.",
    collections: "\n\n## Explorez Nos Collections\n\nVos accessoires sont prêts ? Commencez à créer avec nos collections de recettes testées :\n\n[collection slug=\"ice-cream\"]\n\n[collection slug=\"soft-serve\"]\n\n[collection slug=\"frozen-yogurt\"]",
  },
  de: {
    title: "Die besten Ninja Creami Zubehörteile, die sich lohnen",
    excerpt: "Von zusätzlichen Bechern bis Küchenwaagen: Entdecken Sie das Zubehör, das Ihr Ninja Creami Erlebnis wirklich verbessert.",
    collections: "\n\n## Entdecken Sie unsere Kollektionen\n\nZubehör bereit? Legen Sie los mit unseren erprobten Rezept-Kollektionen:\n\n[collection slug=\"ice-cream\"]\n\n[collection slug=\"soft-serve\"]\n\n[collection slug=\"frozen-yogurt\"]",
  },
  pt: {
    title: "Os melhores acessórios Ninja Creami que valem a pena comprar",
    excerpt: "De potes extras a balanças de cozinha, descubra os acessórios que realmente melhoram a sua experiência Ninja Creami.",
    collections: "\n\n## Explora as nossas coleções\n\nJá tens os acessórios prontos? Começa a criar com as nossas coleções de receitas testadas:\n\n[collection slug=\"ice-cream\"]\n\n[collection slug=\"soft-serve\"]\n\n[collection slug=\"frozen-yogurt\"]",
  },
};

(async () => {
  const { data: post } = await supabase.from('posts').select('id').eq('slug', 'best-creami-accessories').single();
  if (!post) { console.error('post not found'); process.exit(1); }

  for (const [locale, patch] of Object.entries(patches)) {
    const { data: row } = await supabase.from('post_translations').select('body').eq('post_id', post.id).eq('locale', locale).single();
    if (!row) { console.error(`no ${locale} row`); continue; }
    const body = (row.body as string).trimEnd() + patch.collections;
    const wc = body.split(/\s+/).filter(Boolean).length;
    console.log(`[${locale}] title+excerpt restored, body ${wc} words (collections section appended)`);
    if (apply) {
      const { error } = await supabase.from('post_translations').update({
        title: patch.title,
        excerpt: patch.excerpt,
        body,
      }).eq('post_id', post.id).eq('locale', locale);
      if (error) { console.error(`ERR ${locale}: ${error.message}`); process.exit(1); }
      console.log(`  applied`);
    }
  }
  console.log(apply ? 'Done.' : 'Dry run. Use --apply to write.');
})();
