
-- Add new columns to testimonials table
ALTER TABLE public.testimonials 
ADD COLUMN feedback_picture text,
ADD COLUMN email text,
ADD COLUMN email_censored boolean DEFAULT false,
ADD COLUMN name_censored boolean DEFAULT false,
ADD COLUMN company_censored boolean DEFAULT false;

-- Update default values for name and company
ALTER TABLE public.testimonials 
ALTER COLUMN name SET DEFAULT '**********************',
ALTER COLUMN company SET DEFAULT '************************';
