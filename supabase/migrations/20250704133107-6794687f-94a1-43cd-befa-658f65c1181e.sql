
-- Add user_id column to projects table to associate projects with users
ALTER TABLE public.projects 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Update RLS policies to ensure users can only manage their own projects
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;

-- Allow anyone to view projects (public portfolio)
CREATE POLICY "Anyone can view projects" 
  ON public.projects 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert projects with their user_id
CREATE POLICY "Authenticated users can insert projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also update carousel images policies to ensure proper access control
DROP POLICY IF EXISTS "Anyone can insert project carousel images" ON public.project_carousel_images;

CREATE POLICY "Authenticated users can insert carousel images" 
  ON public.project_carousel_images 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their project carousel images" 
  ON public.project_carousel_images 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their project carousel images" 
  ON public.project_carousel_images 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));
