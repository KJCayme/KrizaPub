-- Make the portfolio storage bucket public so images can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'portfolio';

-- Create policies for public access to portfolio images
CREATE POLICY "Portfolio images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "Anyone can upload to portfolio bucket" 
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