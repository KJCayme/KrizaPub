
-- Update the trigger function to completely remove the skills_exp reference
CREATE OR REPLACE FUNCTION public.handle_new_skill()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into skills_expertise with default values
  INSERT INTO public.skills_expertise (skill_id, expertise_level, years_experience)
  VALUES (NEW.id, 'Intermediate', 1);

  RETURN NEW;
END;
$$;
