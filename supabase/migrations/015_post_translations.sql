-- Blog post translations table
CREATE TABLE IF NOT EXISTS post_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'es', 'de', 'pt')),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, locale)
);

-- RLS: public read
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read post_translations" ON post_translations FOR SELECT USING (true);

-- Index for fast lookups
CREATE INDEX idx_post_translations_post_locale ON post_translations(post_id, locale);
