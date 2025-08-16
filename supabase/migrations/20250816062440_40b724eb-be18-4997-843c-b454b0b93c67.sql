
-- Add video support to project carousel images
ALTER TABLE project_carousel_images 
ADD COLUMN media_type VARCHAR(10) DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Add optional video thumbnail for better UX
ALTER TABLE project_carousel_images 
ADD COLUMN video_thumbnail_url TEXT;

-- Update existing records to have media_type as 'image'
UPDATE project_carousel_images SET media_type = 'image' WHERE media_type IS NULL;
