-- Add resume fields to profile table
ALTER TABLE public.profile 
ADD COLUMN resume_url text,
ADD COLUMN resume_filename text,
ADD COLUMN resume_uploaded_at timestamp with time zone;