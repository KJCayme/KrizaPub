-- Create Get In Touch table
CREATE TABLE public.get_in_touch (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text NOT NULL,
  social text NOT NULL,
  caption text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.get_in_touch ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view get in touch data" 
ON public.get_in_touch 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert get in touch data" 
ON public.get_in_touch 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update get in touch data" 
ON public.get_in_touch 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can delete get in touch data" 
ON public.get_in_touch 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Create Why Choose Me table
CREATE TABLE public.why_choose_me (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caption text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.why_choose_me ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view why choose me data" 
ON public.why_choose_me 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert why choose me data" 
ON public.why_choose_me 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update why choose me data" 
ON public.why_choose_me 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can delete why choose me data" 
ON public.why_choose_me 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_get_in_touch_updated_at
  BEFORE UPDATE ON public.get_in_touch
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_why_choose_me_updated_at
  BEFORE UPDATE ON public.why_choose_me
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();