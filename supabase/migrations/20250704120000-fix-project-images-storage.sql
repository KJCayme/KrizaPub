
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

-- Create storage policies for the portfolio bucket
CREATE POLICY "Anyone can view portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Anyone can upload portfolio images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Anyone can update portfolio images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio');

CREATE POLICY "Anyone can delete portfolio images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio');
