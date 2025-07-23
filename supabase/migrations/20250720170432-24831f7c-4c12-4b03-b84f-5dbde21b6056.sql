
-- Create the portfolio skill categories table
CREATE TABLE public.port_skill_cat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category_key text NOT NULL UNIQUE,
  badge text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the existing skill categories
INSERT INTO public.port_skill_cat (name, category_key, badge) VALUES
('Admin Support', 'admin', NULL),
('Social Media', 'social', NULL),
('Project Management', 'project', NULL),
('Design & Creative', 'design', NULL),
('Copywriting', 'copywriting', NULL),
('Web Development', 'webdev', 'Soon!'),
('AI Automation', 'ai', 'Soon!');

-- Add RLS policies for the port_skill_cat table
ALTER TABLE public.port_skill_cat ENABLE ROW LEVEL SECURITY;

-- Anyone can view portfolio skill categories
CREATE POLICY "Anyone can view portfolio skill categories" 
  ON public.port_skill_cat 
  FOR SELECT 
  USING (true);

-- Authenticated users can insert portfolio skill categories
CREATE POLICY "Authenticated users can insert portfolio skill categories" 
  ON public.port_skill_cat 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update portfolio skill categories
CREATE POLICY "Authenticated users can update portfolio skill categories" 
  ON public.port_skill_cat 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Authenticated users can delete portfolio skill categories
CREATE POLICY "Authenticated users can delete portfolio skill categories" 
  ON public.port_skill_cat 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Add foreign key constraint to projects table
ALTER TABLE public.projects 
ADD CONSTRAINT fk_projects_category 
FOREIGN KEY (category) 
REFERENCES public.port_skill_cat(category_key);
