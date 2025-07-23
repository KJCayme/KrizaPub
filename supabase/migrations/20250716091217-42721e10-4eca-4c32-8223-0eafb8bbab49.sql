
-- Allow authenticated users to insert new hobbies
CREATE POLICY "Authenticated users can insert new hobbies" 
ON public.about_hobbies 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);
