-- Add missing columns to skills_main table
ALTER TABLE public.skills_main 
ADD COLUMN description text,
ADD COLUMN icon text,
ADD COLUMN badge text,
ADD COLUMN color text DEFAULT 'from-blue-500 to-cyan-500',
ADD COLUMN keyservice_id bigint REFERENCES public.key_service(id) ON DELETE SET NULL;

-- Update skills_expertise table to add details field for key services
ALTER TABLE public.skills_expertise 
ADD COLUMN details text[];

-- Update existing skills_main records with default values for new columns
UPDATE public.skills_main 
SET 
  description = 'Professional ' || skill_name || ' services',
  icon = 'Star'
WHERE description IS NULL;