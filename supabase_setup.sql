-- Create Sightings table
CREATE TABLE sightings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  country TEXT DEFAULT 'Unknown',
  city TEXT DEFAULT 'Unknown',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitter_name TEXT DEFAULT 'Unknown',
  caption TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  approved BOOLEAN DEFAULT TRUE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0
);

-- Create Sighting Comments table
CREATE TABLE sighting_comments (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sighting_id BIGINT REFERENCES sightings(id) ON DELETE CASCADE,
  author TEXT DEFAULT 'Anonymous',
  content TEXT NOT NULL
);

-- Create function to increment comment count via RPC
CREATE OR REPLACE FUNCTION increment_comment_count(sighting_id_input BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE sightings
  SET comment_count = comment_count + 1
  WHERE id = sighting_id_input;
END;
$$ LANGUAGE plpgsql;
