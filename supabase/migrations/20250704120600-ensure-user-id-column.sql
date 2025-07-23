
-- Ensure the projects table has the user_id column
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make sure the column is properly indexed for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Update any existing projects to have a user_id if they don't have one
-- (This is safe to run multiple times)
DO $$
BEGIN
  -- Only update if there are projects without user_id
  IF EXISTS (SELECT 1 FROM public.projects WHERE user_id IS NULL LIMIT 1) THEN
    -- For demo purposes, we'll just log this - in production you'd want to handle this differently
    RAISE NOTICE 'Found projects without user_id - these will need to be manually assigned to users';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create new policies with correct names
CREATE POLICY "Anyone can view projects" 
  ON public.projects 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also ensure project_carousel_images table has proper RLS
ALTER TABLE public.project_carousel_images ENABLE ROW LEVEL SECURITY;

-- Drop and recreate carousel image policies
DROP POLICY IF EXISTS "Anyone can view project carousel images" ON public.project_carousel_images;
DROP POLICY IF EXISTS "Authenticated users can insert carousel images" ON public.project_carousel_images;
DROP POLICY IF EXISTS "Users can update their project carousel images" ON public.project_carousel_images;
DROP POLICY IF EXISTS "Users can delete their project carousel images" ON public.project_carousel_images;

CREATE POLICY "Anyone can view project carousel images" 
  ON public.project_carousel_images 
  FOR SELECT 
  USING (true);

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
