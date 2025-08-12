
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useAddProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Omit<Tables<'projects'>, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Error adding project:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tables<'projects'>> }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
