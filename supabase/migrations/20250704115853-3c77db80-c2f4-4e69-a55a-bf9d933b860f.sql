
-- Update RLS policies to allow inserting projects
CREATE POLICY "Anyone can insert projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can insert project carousel images" 
  ON public.project_carousel_images 
  FOR INSERT 
  WITH CHECK (true);
