-- Allow anonymous users to update their own ratings (needed for upsert)
CREATE POLICY "Anyone can update ratings" ON anonymous_ratings
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow select for rate-limiting check
CREATE POLICY "Anyone can read own ratings for rate limiting" ON anonymous_ratings
  FOR SELECT USING (true);
