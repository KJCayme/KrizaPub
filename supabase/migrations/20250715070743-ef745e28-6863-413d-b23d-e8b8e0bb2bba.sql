
-- Add role column to profile table since it was removed but is needed
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS role TEXT;

-- Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id, name, role, caption)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Kenneth John Cayme'), 'General Virtual Assistant', 'Empowering businesses through exceptional virtual assistance');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update storage path for profile images to use 'profiles' folder consistently
-- Create policy for profiles folder in portfolio bucket
CREATE POLICY IF NOT EXISTS "Allow public access to profiles folder" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'profiles');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload to profiles folder" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow users to update their own profile images" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow users to delete their own profile images" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'profiles' AND auth.role() = 'authenticated');
