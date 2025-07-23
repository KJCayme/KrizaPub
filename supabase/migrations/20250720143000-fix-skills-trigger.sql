
-- Fix the trigger function to reference the correct table name
CREATE OR REPLACE FUNCTION public.handle_new_skill()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into skills_expertise with default values (removed the faulty skills_exp reference)
  INSERT INTO public.skills_expertise (skill_id, expertise_level, years_experience)
  VALUES (NEW.id, 'Intermediate', 1);

  RETURN NEW;
END;
$$;
