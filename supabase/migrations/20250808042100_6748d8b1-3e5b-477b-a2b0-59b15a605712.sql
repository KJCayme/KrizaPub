
-- Drop the existing table to recreate with dark mode support
DROP TABLE IF EXISTS public.site_theme_settings;

-- Create a comprehensive table to store all theme variables for both light and dark modes
CREATE TABLE public.site_theme_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  theme_name TEXT NOT NULL DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  
  -- Light Mode Variables
  -- Hero Section
  hero_bg_start_light TEXT DEFAULT '222.2 47.4% 11.2%',
  hero_bg_mid_light TEXT DEFAULT '220 60% 40%',
  hero_bg_end_light TEXT DEFAULT '270 60% 50%',
  hero_blob_1_light TEXT DEFAULT '210 100% 70%',
  hero_blob_2_light TEXT DEFAULT '270 100% 70%',
  hero_blob_3_light TEXT DEFAULT '330 100% 70%',
  hero_text_primary_light TEXT DEFAULT '0 0% 100%',
  hero_text_secondary_light TEXT DEFAULT '215 20.2% 65.1%',
  
  -- About Section
  about_bg_start_light TEXT DEFAULT '210 40% 98%',
  about_bg_end_light TEXT DEFAULT '214 100% 97%',
  about_text_primary_light TEXT DEFAULT '215.4 16.3% 25.1%',
  about_text_secondary_light TEXT DEFAULT '215.4 16.3% 46.9%',
  
  -- Navigation
  nav_bg_light TEXT DEFAULT '0 0% 100% / 0.9',
  nav_text_light TEXT DEFAULT '215.4 16.3% 46.9%',
  nav_text_hover_light TEXT DEFAULT '213 100% 60%',
  nav_text_active_light TEXT DEFAULT '213 100% 60%',
  
  -- Skills Section
  skills_bg_start_light TEXT DEFAULT '210 40% 98%',
  skills_bg_end_light TEXT DEFAULT '214 100% 97%',
  skills_text_primary_light TEXT DEFAULT '215.4 16.3% 25.1%',
  
  -- Portfolio Section
  portfolio_bg_start_light TEXT DEFAULT '0 0% 100%',
  portfolio_bg_end_light TEXT DEFAULT '214 100% 97%',
  portfolio_text_primary_light TEXT DEFAULT '215.4 16.3% 25.1%',
  
  -- Config Section
  config_bg_start_light TEXT DEFAULT '210 40% 98%',
  config_bg_end_light TEXT DEFAULT '214 100% 97%',
  config_text_primary_light TEXT DEFAULT '215.4 16.3% 25.1%',
  config_button_purple_start_light TEXT DEFAULT '270 91% 65%',
  config_button_purple_end_light TEXT DEFAULT '330 81% 60%',
  
  -- Dark Mode Variables
  -- Hero Section
  hero_bg_start_dark TEXT DEFAULT '222.2 47.4% 6%',
  hero_bg_mid_dark TEXT DEFAULT '220 60% 20%',
  hero_bg_end_dark TEXT DEFAULT '270 60% 30%',
  hero_blob_1_dark TEXT DEFAULT '210 100% 60%',
  hero_blob_2_dark TEXT DEFAULT '270 100% 60%',
  hero_blob_3_dark TEXT DEFAULT '330 100% 60%',
  hero_text_primary_dark TEXT DEFAULT '210 40% 98%',
  hero_text_secondary_dark TEXT DEFAULT '215 20.2% 65.1%',
  
  -- About Section
  about_bg_start_dark TEXT DEFAULT '222.2 84% 4.9%',
  about_bg_end_dark TEXT DEFAULT '215.4 16.3% 25.1%',
  about_text_primary_dark TEXT DEFAULT '210 40% 98%',
  about_text_secondary_dark TEXT DEFAULT '215 20.2% 65.1%',
  
  -- Navigation
  nav_bg_dark TEXT DEFAULT '222.2 84% 4.9% / 0.9',
  nav_text_dark TEXT DEFAULT '215 20.2% 65.1%',
  nav_text_hover_dark TEXT DEFAULT '214 100% 80%',
  nav_text_active_dark TEXT DEFAULT '214 100% 80%',
  
  -- Skills Section
  skills_bg_start_dark TEXT DEFAULT '222.2 84% 4.9%',
  skills_bg_end_dark TEXT DEFAULT '215.4 16.3% 25.1%',
  skills_text_primary_dark TEXT DEFAULT '210 40% 98%',
  
  -- Portfolio Section
  portfolio_bg_start_dark TEXT DEFAULT '222.2 84% 4.9%',
  portfolio_bg_end_dark TEXT DEFAULT '215.4 16.3% 25.1%',
  portfolio_text_primary_dark TEXT DEFAULT '210 40% 98%',
  
  -- Config Section
  config_bg_start_dark TEXT DEFAULT '222.2 84% 4.9%',
  config_bg_end_dark TEXT DEFAULT '215.4 16.3% 25.1%',
  config_text_primary_dark TEXT DEFAULT '210 40% 98%',
  config_button_purple_start_dark TEXT DEFAULT '270 91% 55%',
  config_button_purple_end_dark TEXT DEFAULT '330 81% 50%',
  
  UNIQUE(theme_name)
);

-- Enable RLS
ALTER TABLE public.site_theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active theme settings" 
  ON public.site_theme_settings 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage theme settings" 
  ON public.site_theme_settings 
  FOR ALL
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Insert predefined themes with both light and dark mode values
INSERT INTO public.site_theme_settings (
  theme_name, is_active,
  -- Light mode values
  hero_bg_start_light, hero_bg_mid_light, hero_bg_end_light,
  hero_blob_1_light, hero_blob_2_light, hero_blob_3_light,
  config_button_purple_start_light, config_button_purple_end_light,
  -- Dark mode values  
  hero_bg_start_dark, hero_bg_mid_dark, hero_bg_end_dark,
  hero_blob_1_dark, hero_blob_2_dark, hero_blob_3_dark,
  config_button_purple_start_dark, config_button_purple_end_dark
) VALUES 
-- Default theme
('default', true, 
 '222.2 47.4% 11.2%', '220 60% 40%', '270 60% 50%', '210 100% 70%', '270 100% 70%', '330 100% 70%', '270 91% 65%', '330 81% 60%',
 '222.2 47.4% 6%', '220 60% 20%', '270 60% 30%', '210 100% 60%', '270 100% 60%', '330 100% 60%', '270 91% 55%', '330 81% 50%'),

-- Lavender theme
('lavender', false,
 '270 30% 25%', '280 60% 45%', '290 70% 65%', '270 80% 75%', '300 80% 75%', '260 80% 75%', '270 91% 65%', '300 81% 60%',
 '270 25% 15%', '280 55% 35%', '290 65% 45%', '270 75% 65%', '300 75% 65%', '260 75% 65%', '270 91% 55%', '300 81% 50%'),

-- Colorful theme
('colorful', false,
 '0 0% 0%', '277 83% 54%', '290 59% 63%', '277 83% 54%', '290 59% 63%', '50 91% 77%', '277 83% 54%', '290 59% 63%',
 '0 0% 0%', '277 83% 44%', '290 59% 53%', '277 83% 44%', '290 59% 53%', '50 91% 67%', '277 83% 44%', '290 59% 53%');

-- Create trigger to update updated_at
CREATE TRIGGER update_site_theme_settings_updated_at 
  BEFORE UPDATE ON public.site_theme_settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table
ALTER TABLE public.site_theme_settings REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.site_theme_settings;
