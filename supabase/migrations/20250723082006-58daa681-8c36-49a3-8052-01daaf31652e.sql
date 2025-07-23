
-- Add a function to generate random codes
CREATE OR REPLACE FUNCTION generate_random_code(length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on client_testimonials table
ALTER TABLE public.client_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to view client testimonials
CREATE POLICY "Anyone can view client testimonials" 
ON public.client_testimonials 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert client testimonials
CREATE POLICY "Authenticated users can insert client testimonials" 
ON public.client_testimonials 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for anyone to update client testimonials using code
CREATE POLICY "Anyone can update client testimonials with valid code" 
ON public.client_testimonials 
FOR UPDATE 
USING (code IS NOT NULL AND code != '');

-- Create policy for authenticated users to delete client testimonials
CREATE POLICY "Authenticated users can delete client testimonials" 
ON public.client_testimonials 
FOR DELETE 
USING (auth.role() = 'authenticated');
