
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformProjects } from '@/utils/projectHelpers';
import { usePortfolioCategories } from './usePortfolioCategories';

export const usePrefetchAllProjects = () => {
  const queryClient = useQueryClient();
  const { data: categoriesData } = usePortfolioCategories();

  const prefetchAllProjects = async () => {
    if (!categoriesData) return;

    console.log('🚀 Starting prefetch of all projects data...');

    // Prefetch all projects first
    const allProjectsQuery = queryClient.getQueryData(['projects']);
    if (!allProjectsQuery) {
      console.log('📊 Prefetching all projects...');
      await queryClient.prefetchQuery({
        queryKey: ['projects'],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error prefetching all projects:', error);
            throw error;
          }

          return transformProjects(data || []);
        },
        staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
      });
    }

    // Then prefetch by category for faster category switching
    const prefetchPromises = categoriesData.map(async (category) => {
      const existingData = queryClient.getQueryData(['projects', category.category_key]);
      if (!existingData) {
        console.log(`📂 Prefetching projects for category: ${category.category_key}`);
        
        return queryClient.prefetchQuery({
          queryKey: ['projects', category.category_key],
          queryFn: async () => {
            let query = supabase
              .from('projects')
              .select('*')
              .eq('category', category.category_key)
              .order('created_at', { ascending: false });

            // For Admin Support category, limit to 5 projects
            if (category.category_key === 'admin') {
              query = query.limit(5);
            }

            const { data, error } = await query;

            if (error) {
              console.error(`Error prefetching projects for ${category.category_key}:`, error);
              throw error;
            }

            return transformProjects(data || []);
          },
          staleTime: 5 * 60 * 1000,
        });
      }
    });

    await Promise.allSettled(prefetchPromises);
    console.log('✅ All projects prefetching completed');
  };

  return { prefetchAllProjects };
};
