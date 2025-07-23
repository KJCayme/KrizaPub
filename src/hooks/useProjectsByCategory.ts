import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformProjects } from '@/utils/projectHelpers';

export const useProjectsByCategory = (category: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['projects', category],
    queryFn: async () => {
      console.log(`Fetching projects for category: ${category}`);
      
      let query = supabase
        .from('projects')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      // For Admin Support category, limit to 5 projects
      if (category === 'admin') {
        query = query.limit(5);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects by category:', error);
        throw error;
      }

      console.log(`Fetched projects for ${category}:`, data);
      const transformedProjects = transformProjects(data || []);
      return transformedProjects;
    },
    enabled, // Only fetch when enabled is true
  });
};