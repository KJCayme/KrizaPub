
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { transformProjects } from '@/utils/projectHelpers';

export type Project = Tables<'projects'> & {
  // Add computed properties for compatibility with existing code
  description: string;
  image: string;
  tags: string[];
  duration: string;
  icon: React.ReactNode;
  detailedProcess?: string;
  detailedResults?: string;
  problem?: string;
  solution?: string;
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects from Supabase...');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Fetched projects:', data);
      const transformedProjects = transformProjects(data || []);
      console.log('Transformed projects:', transformedProjects);
      return transformedProjects;
    },
  });
};

export const useProjectsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['projects', category],
    queryFn: async () => {
      console.log(`Fetching projects for category: ${category}`);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects by category:', error);
        throw error;
      }

      console.log(`Fetched projects for ${category}:`, data);
      const transformedProjects = transformProjects(data || []);
      return transformedProjects;
    },
  });
};
