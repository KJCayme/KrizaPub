
-- Create a table for roles that can be displayed in the hero section
CREATE TABLE public.hero_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on hero_roles table
ALTER TABLE public.hero_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view active roles
CREATE POLICY "Anyone can view active hero roles" ON public.hero_roles
  FOR SELECT USING (is_active = true);

-- Create policy to allow authenticated users to manage roles
CREATE POLICY "Authenticated users can insert hero roles" ON public.hero_roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero roles" ON public.hero_roles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero roles" ON public.hero_roles
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert the default roles
INSERT INTO public.hero_roles (role_title, display_order) VALUES
  ('General Virtual Assistant', 1),
  ('Social Media Manager', 2),
  ('Project Manager', 3),
  ('Graphic Designer', 4),
  ('Copywriter', 5),
  ('a FRIEND if needed', 6);
