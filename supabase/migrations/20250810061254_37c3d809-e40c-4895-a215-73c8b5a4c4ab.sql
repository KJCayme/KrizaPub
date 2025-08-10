-- Create a public videos bucket if it doesn't exist and policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'videos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
  END IF;
END $$;

-- Policies for videos bucket
DO $$
BEGIN
  -- Public read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view videos'
  ) THEN
    CREATE POLICY "Public can view videos"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'videos');
  END IF;

  -- Authenticated upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload videos'
  ) THEN
    CREATE POLICY "Authenticated users can upload videos"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can update videos'
  ) THEN
    CREATE POLICY "Authenticated users can update videos"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
  END IF;

  -- Authenticated delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can delete videos'
  ) THEN
    CREATE POLICY "Authenticated users can delete videos"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Create site_video table to hold current intro video metadata
CREATE TABLE IF NOT EXISTS public.site_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_path TEXT NOT NULL,
  poster_path TEXT,
  captions_path TEXT,
  title TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.site_video ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_video' AND policyname = 'Anyone can view active site video'
  ) THEN
    CREATE POLICY "Anyone can view active site video"
    ON public.site_video
    FOR SELECT
    USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_video' AND policyname = 'Authenticated users can manage site video'
  ) THEN
    CREATE POLICY "Authenticated users can manage site video"
    ON public.site_video
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Updated_at trigger
CREATE TRIGGER update_site_video_updated_at
BEFORE UPDATE ON public.site_video
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();