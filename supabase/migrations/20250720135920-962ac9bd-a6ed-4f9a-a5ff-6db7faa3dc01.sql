
-- First, let's create the main skills table
CREATE TABLE public.skills_main (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create the Skills_Expertise table that references skills_main
CREATE TABLE public.skills_expertise (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id uuid REFERENCES public.skills_main(id) ON DELETE CASCADE,
  expertise_level text CHECK (expertise_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  years_experience integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create portfolio_skills table for linking skills to portfolio projects
CREATE TABLE public.portfolio_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id uuid REFERENCES public.skills_main(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(skill_id, project_id)
);

-- Add RLS policies for skills_main
ALTER TABLE public.skills_main ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" 
  ON public.skills_main 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert skills" 
  ON public.skills_main 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update skills" 
  ON public.skills_main 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete skills" 
  ON public.skills_main 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Add RLS policies for skills_expertise
ALTER TABLE public.skills_expertise ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills expertise" 
  ON public.skills_expertise 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage skills expertise" 
  ON public.skills_expertise 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Add RLS policies for portfolio_skills
ALTER TABLE public.portfolio_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio skills" 
  ON public.portfolio_skills 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their portfolio skills" 
  ON public.portfolio_skills 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = portfolio_skills.project_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = portfolio_skills.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Create trigger function to auto-update skills_exp and portfolio_skills when a skill is added
CREATE OR REPLACE FUNCTION public.handle_new_skill()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into skills_exp table (keeping backward compatibility with existing skills_exp table)
  INSERT INTO public.skills_exp (skills)
  VALUES (NEW.skill_name)
  ON CONFLICT DO NOTHING;

  -- Insert into skills_expertise with default values
  INSERT INTO public.skills_expertise (skill_id, expertise_level, years_experience)
  VALUES (NEW.id, 'Intermediate', 1);

  RETURN NEW;
END;
$$;

-- Create trigger to fire the function when a new skill is inserted
CREATE TRIGGER on_skill_inserted
  AFTER INSERT ON public.skills_main
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_skill();

-- Update existing skills data if any exists in the old skills table
INSERT INTO public.skills_main (skill_name)
SELECT DISTINCT skills 
FROM public.skills_exp 
WHERE skills IS NOT NULL
ON CONFLICT (skill_name) DO NOTHING;
