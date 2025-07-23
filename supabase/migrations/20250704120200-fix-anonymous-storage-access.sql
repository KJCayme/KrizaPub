
-- Drop existing storage policies to start fresh
DROP POLICY IF EXISTS "Public can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow bucket creation" ON storage.buckets;

-- Make sure the portfolio bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create completely open policies for the portfolio bucket
CREATE POLICY "Allow all operations on portfolio bucket"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'portfolio')
  WITH CHECK (bucket_id = 'portfolio');

-- Also ensure bucket access is allowed
CREATE POLICY "Allow public bucket access"
  ON storage.buckets
  FOR ALL
  USING (true)
  WITH CHECK (true);
