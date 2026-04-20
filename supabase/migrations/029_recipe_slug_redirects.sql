-- Recipe slug redirects: map old (retired) slugs to current slugs so renames
-- don't drop accumulated SEO signal or break inbound links.
--
-- Rows live forever. Do not delete even for ancient renames — users and
-- crawlers may still hit the old URL from archived links, bookmarks, and
-- search index cache entries. The PK collision guard (ON CONFLICT) makes
-- it safe to re-insert the same row idempotently.
CREATE TABLE recipe_slug_redirects (
  old_slug   TEXT PRIMARY KEY,
  new_slug   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- new_slug should be an actual recipes.slug value. We intentionally do NOT
-- use a FK — recipes with FK constraints become awkward to delete/replace,
-- and the redirect still wants to live even if the target recipe is briefly
-- missing (e.g. during a staged republish). We defend via app-layer check:
-- the handler in [slug].astro only emits a 301 if the new_slug resolves.
CREATE INDEX idx_recipe_slug_redirects_new_slug ON recipe_slug_redirects(new_slug);

ALTER TABLE recipe_slug_redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read recipe slug redirects"
  ON recipe_slug_redirects FOR SELECT USING (true);
CREATE POLICY "Admins manage recipe slug redirects"
  ON recipe_slug_redirects FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
