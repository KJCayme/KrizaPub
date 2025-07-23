
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete portfolio images" ON storage.objects;

-- Create new policies that work with authenticated users
CREATE POLICY "Public can view portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can update portfolio images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can delete portfolio images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio');

-- Also need to add user_id column to projects table and update RLS policies
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS policies for projects table
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects" 
  ON public.projects 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert projects" 
  ON public.projects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Update RLS policies for project carousel images
DROP POLICY IF EXISTS "Anyone can view project carousel images" ON public.project_carousel_images;
CREATE POLICY "Anyone can view project carousel images" 
  ON public.project_carousel_images 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert carousel images" 
  ON public.project_carousel_images 
  FOR INSERT 
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their project carousel images" 
  ON public.project_carousel_images 
  FOR UPDATE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their project carousel images" 
  ON public.project_carousel_images 
  FOR DELETE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));
