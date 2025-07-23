
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete portfolio images" ON storage.objects;

-- Create storage bucket for project images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create more permissive storage policies for the portfolio bucket
CREATE POLICY "Public can view portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Public can upload portfolio images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Public can update portfolio images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio')
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Public can delete portfolio images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio');

-- Ensure the bucket creation policies allow public access
CREATE POLICY IF NOT EXISTS "Allow bucket creation"
  ON storage.buckets
  FOR ALL
  USING (true)
  WITH CHECK (true);
