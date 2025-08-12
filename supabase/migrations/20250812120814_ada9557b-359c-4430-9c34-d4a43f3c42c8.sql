
-- Add uploaded_icon column to tools table to store base64 encoded custom icons
ALTER TABLE public.tools ADD COLUMN uploaded_icon text;
