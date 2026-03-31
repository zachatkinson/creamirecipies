-- Allow half-star ratings (0.5 increments) in anonymous_ratings
ALTER TABLE anonymous_ratings
  ALTER COLUMN rating TYPE NUMERIC(2,1);

ALTER TABLE anonymous_ratings
  DROP CONSTRAINT IF EXISTS anonymous_ratings_rating_check;

ALTER TABLE anonymous_ratings
  ADD CONSTRAINT anonymous_ratings_rating_check
  CHECK (rating >= 0.5 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2));

-- Also update reviews table to support half-star ratings
ALTER TABLE reviews
  ALTER COLUMN rating TYPE NUMERIC(2,1);

ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_rating_check;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_rating_check
  CHECK (rating >= 0.5 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2));
