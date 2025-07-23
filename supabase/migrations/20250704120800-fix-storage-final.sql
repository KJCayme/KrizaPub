-- First, ensure the portfolio bucket exists with correct settings
DO $$
BEGIN
  -- Delete and recreate the bucket to ensure clean state
  DELETE FROM storage.buckets WHERE id = 'portfolio';
  
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('portfolio', 'portfolio', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
END $$;

-- Remove ALL existing storage policies
DROP POLICY IF EXISTS "Anyone can view portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their portfolio images" ON storage.objects;

-- Create simple policies that definitely work
CREATE POLICY "portfolio_select_policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "portfolio_insert_policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "portfolio_update_policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "portfolio_delete_policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio' 
    AND auth.uid() IS NOT NULL
  );