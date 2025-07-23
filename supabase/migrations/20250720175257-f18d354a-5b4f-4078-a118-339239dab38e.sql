-- Add hidden column to port_skill_cat table
ALTER TABLE public.port_skill_cat 
ADD COLUMN hidden boolean NOT NULL DEFAULT false;