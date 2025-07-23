
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformProjects } from '@/utils/projectHelpers';

export const usePrefetchProjects = () => {
  const queryClient = useQueryClient();

  const prefetchProjectsByCategory = async (category: string) => {
    // Check if data is already in cache
    const existingData = queryClient.getQueryData(['projects', category]);
    if (existingData) {
      console.log(`Projects for ${category} already cached`);
      return;
    }

    console.log(`Prefetching projects for category: ${category}`);
    
    await queryClient.prefetchQuery({
      queryKey: ['projects', category],
      queryFn: async () => {
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
          console.error('Error prefetching projects:', error);
          throw error;
        }

        return transformProjects(data || []);
      },
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    });
  };

  return { prefetchProjectsByCategory };
};
