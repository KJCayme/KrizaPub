
-- Update testimonials table to match the requirements
ALTER TABLE public.testimonials 
ALTER COLUMN name SET DEFAULT 'Non-Disclosure',
ALTER COLUMN company DROP NOT NULL,
ADD COLUMN feedback text;

-- Add check constraint for rate to be between 1 and 5
ALTER TABLE public.testimonials 
ADD CONSTRAINT rate_check CHECK (rate >= 1 AND rate <= 5);

-- Enable RLS on testimonials table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to view testimonials
CREATE POLICY "Anyone can view testimonials" 
ON public.testimonials 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert testimonials
CREATE POLICY "Authenticated users can insert testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for users to update their own testimonials
CREATE POLICY "Users can update their own testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to delete their own testimonials
CREATE POLICY "Users can delete their own testimonials" 
ON public.testimonials 
FOR DELETE 
USING (auth.uid() = user_id);
