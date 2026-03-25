-- Add video URL to recipes for embedded recipe videos
ALTER TABLE recipes ADD COLUMN video_url TEXT;
ALTER TABLE recipes ADD COLUMN video_thumbnail_url TEXT;

-- Add meta fields for better SEO control
ALTER TABLE recipes ADD COLUMN meta_title TEXT;
ALTER TABLE recipes ADD COLUMN meta_description TEXT;
