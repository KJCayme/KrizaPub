
-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  issued_by TEXT NOT NULL,
  caption TEXT,
  skills_covered TEXT[] NOT NULL DEFAULT '{}',
  link TEXT,
  certificate_image_card TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates
CREATE POLICY "Anyone can view certificates" 
  ON public.certificates 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert certificates" 
  ON public.certificates 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates" 
  ON public.certificates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certificates" 
  ON public.certificates 
  FOR DELETE 
  USING (auth.uid() = user_id);
