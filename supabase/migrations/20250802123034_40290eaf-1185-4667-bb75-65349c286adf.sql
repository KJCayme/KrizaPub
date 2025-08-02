-- Make category field nullable in tools table
ALTER TABLE public.tools ALTER COLUMN category DROP NOT NULL;