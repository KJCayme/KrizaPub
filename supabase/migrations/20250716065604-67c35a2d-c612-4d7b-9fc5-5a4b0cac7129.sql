
-- Enable RLS and create policies for about_info table
ALTER TABLE public.about_info ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view about_info (public data)
CREATE POLICY "Anyone can view about info" 
  ON public.about_info 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert about_info
CREATE POLICY "Authenticated users can insert about info" 
  ON public.about_info 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update about_info
CREATE POLICY "Authenticated users can update about info" 
  ON public.about_info 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Enable RLS and create policies for about_hobbies table
ALTER TABLE public.about_hobbies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view about_hobbies (public data)
CREATE POLICY "Anyone can view about hobbies" 
  ON public.about_hobbies 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to update about_hobbies
CREATE POLICY "Authenticated users can update about hobbies" 
  ON public.about_hobbies 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Enable RLS and create policies for about_hl table
ALTER TABLE public.about_hl ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view about_hl (public data)
CREATE POLICY "Anyone can view about highlights" 
  ON public.about_hl 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to update about_hl
CREATE POLICY "Authenticated users can update about highlights" 
  ON public.about_hl 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');
