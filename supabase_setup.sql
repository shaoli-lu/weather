-- Create Sightings table (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS sightings (
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

-- Create Sighting Comments table (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS sighting_comments (
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

-- RLS CONFIGURATION
-- To ensure maximum compatibility for this platform, we will disable RLS on these two tables.
-- This allows any visitor to read, post, and comment without permission errors.

ALTER TABLE sightings DISABLE ROW LEVEL SECURITY;
ALTER TABLE sighting_comments DISABLE ROW LEVEL SECURITY;

-- INSTRUCTIONS FOR STORAGE:
-- 1. Go to "Storage" in your Supabase Dashboard.
-- 2. Create a new bucket named "sightings".
-- 3. Set the bucket to "Public" so images can be viewed by everyone.
-- 4. In "Policies" for the "sightings" bucket, click "New Policy" -> "Get started quickly".
-- 5. Select "Give users access to ALL objects" (or just Insert/Select) for public users.
