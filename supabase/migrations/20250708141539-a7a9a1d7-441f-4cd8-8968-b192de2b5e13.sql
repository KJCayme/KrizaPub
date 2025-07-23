
-- Drop the existing hero table as we'll use a profile table instead
DROP TABLE IF EXISTS public.hero;

-- Create or update the profile table to match your requirements
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT,
  caption TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profile table
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Create policies for profile table
CREATE POLICY "Anyone can view profiles" ON public.profile
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id, name, role, caption)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Kenneth John Cayme'), 'General Virtual Assistant', 'Empowering businesses through exceptional virtual assistance');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
