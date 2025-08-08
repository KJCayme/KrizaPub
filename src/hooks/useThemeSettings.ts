
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThemeSettings {
  id: string;
  theme_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Light mode variables
  hero_bg_start_light?: string;
  hero_bg_mid_light?: string;
  hero_bg_end_light?: string;
  hero_blob_1_light?: string;
  hero_blob_2_light?: string;
  hero_blob_3_light?: string;
  hero_text_primary_light?: string;
  hero_text_secondary_light?: string;
  about_bg_start_light?: string;
  about_bg_end_light?: string;
  about_text_primary_light?: string;
  about_text_secondary_light?: string;
  nav_bg_light?: string;
  nav_text_light?: string;
  nav_text_hover_light?: string;
  nav_text_active_light?: string;
  skills_bg_start_light?: string;
  skills_bg_end_light?: string;
  skills_text_primary_light?: string;
  portfolio_bg_start_light?: string;
  portfolio_bg_end_light?: string;
  portfolio_text_primary_light?: string;
  config_bg_start_light?: string;
  config_bg_end_light?: string;
  config_text_primary_light?: string;
  config_button_purple_start_light?: string;
  config_button_purple_end_light?: string;
  
  // Dark mode variables
  hero_bg_start_dark?: string;
  hero_bg_mid_dark?: string;
  hero_bg_end_dark?: string;
  hero_blob_1_dark?: string;
  hero_blob_2_dark?: string;
  hero_blob_3_dark?: string;
  hero_text_primary_dark?: string;
  hero_text_secondary_dark?: string;
  about_bg_start_dark?: string;
  about_bg_end_dark?: string;
  about_text_primary_dark?: string;
  about_text_secondary_dark?: string;
  nav_bg_dark?: string;
  nav_text_dark?: string;
  nav_text_hover_dark?: string;
  nav_text_active_dark?: string;
  skills_bg_start_dark?: string;
  skills_bg_end_dark?: string;
  skills_text_primary_dark?: string;
  portfolio_bg_start_dark?: string;
  portfolio_bg_end_dark?: string;
  portfolio_text_primary_dark?: string;
  config_bg_start_dark?: string;
  config_bg_end_dark?: string;
  config_text_primary_dark?: string;
  config_button_purple_start_dark?: string;
  config_button_purple_end_dark?: string;
}

const fetchActiveTheme = async (): Promise<ThemeSettings> => {
  const { data, error } = await supabase
    .from('site_theme_settings')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching active theme:', error);
    throw error;
  }

  return data;
};

const fetchAllThemes = async (): Promise<ThemeSettings[]> => {
  const { data, error } = await supabase
    .from('site_theme_settings')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching themes:', error);
    throw error;
  }

  return data || [];
};

export const useThemeSettings = () => {
  const queryClient = useQueryClient();

  const { data: activeTheme, isLoading } = useQuery({
    queryKey: ['activeTheme'],
    queryFn: fetchActiveTheme,
  });

  const { data: allThemes = [] } = useQuery({
    queryKey: ['allThemes'],
    queryFn: fetchAllThemes,
  });

  const setActiveThemeMutation = useMutation({
    mutationFn: async (themeId: string) => {
      // First, deactivate all themes
      await supabase
        .from('site_theme_settings')
        .update({ is_active: false })
        .neq('id', 'never-match');

      // Then activate the selected theme
      const { data, error } = await supabase
        .from('site_theme_settings')
        .update({ is_active: true })
        .eq('id', themeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeTheme'] });
      queryClient.invalidateQueries({ queryKey: ['allThemes'] });
      toast.success('Theme updated successfully');
    },
    onError: (error) => {
      console.error('Error setting active theme:', error);
      toast.error('Failed to update theme');
    },
  });

  const applyThemeToDOM = (theme: ThemeSettings, isDarkMode: boolean) => {
    const root = document.documentElement;
    
    if (!theme) return;

    const mode = isDarkMode ? 'dark' : 'light';
    
    // Apply CSS variables based on current mode
    const variables: Record<string, string> = {
      '--hero-bg-start': theme[`hero_bg_start_${mode}`] || '',
      '--hero-bg-mid': theme[`hero_bg_mid_${mode}`] || '',
      '--hero-bg-end': theme[`hero_bg_end_${mode}`] || '',
      '--hero-blob-1': theme[`hero_blob_1_${mode}`] || '',
      '--hero-blob-2': theme[`hero_blob_2_${mode}`] || '',
      '--hero-blob-3': theme[`hero_blob_3_${mode}`] || '',
      '--hero-text-primary': theme[`hero_text_primary_${mode}`] || '',
      '--hero-text-secondary': theme[`hero_text_secondary_${mode}`] || '',
      '--about-bg-start': theme[`about_bg_start_${mode}`] || '',
      '--about-bg-end': theme[`about_bg_end_${mode}`] || '',
      '--about-text-primary': theme[`about_text_primary_${mode}`] || '',
      '--about-text-secondary': theme[`about_text_secondary_${mode}`] || '',
      '--nav-bg': theme[`nav_bg_${mode}`] || '',
      '--nav-text': theme[`nav_text_${mode}`] || '',
      '--nav-text-hover': theme[`nav_text_hover_${mode}`] || '',
      '--nav-text-active': theme[`nav_text_active_${mode}`] || '',
      '--skills-bg-start': theme[`skills_bg_start_${mode}`] || '',
      '--skills-bg-end': theme[`skills_bg_end_${mode}`] || '',
      '--skills-text-primary': theme[`skills_text_primary_${mode}`] || '',
      '--portfolio-bg-start': theme[`portfolio_bg_start_${mode}`] || '',
      '--portfolio-bg-end': theme[`portfolio_bg_end_${mode}`] || '',
      '--portfolio-text-primary': theme[`portfolio_text_primary_${mode}`] || '',
      '--config-bg-start': theme[`config_bg_start_${mode}`] || '',
      '--config-bg-end': theme[`config_bg_end_${mode}`] || '',
      '--config-text-primary': theme[`config_text_primary_${mode}`] || '',
      '--config-button-purple-start': theme[`config_button_purple_start_${mode}`] || '',
      '--config-button-purple-end': theme[`config_button_purple_end_${mode}`] || '',
    };

    Object.entries(variables).forEach(([property, value]) => {
      if (value) {
        root.style.setProperty(property, value);
      }
    });
  };

  return {
    activeTheme,
    allThemes,
    isLoading,
    setActiveTheme: setActiveThemeMutation.mutate,
    isSettingTheme: setActiveThemeMutation.isPending,
    applyThemeToDOM,
  };
};
