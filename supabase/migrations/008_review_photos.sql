-- Add photo support to reviews
ALTER TABLE reviews ADD COLUMN photo_urls TEXT[] DEFAULT '{}';

-- Create a storage bucket for review photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can view review photos
CREATE POLICY "Review photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Storage policy: authenticated users can upload review photos
CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'review-photos');

-- Storage policy: users can delete their own review photos
CREATE POLICY "Users can delete own review photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'review-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
