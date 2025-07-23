import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCarouselImages = (projectId: string) => {
  return useQuery({
    queryKey: ['carousel-images', projectId],
    queryFn: async () => {
      console.log('Fetching carousel images for project:', projectId);
      const { data, error } = await supabase
        .from('project_carousel_images')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching carousel images:', error);
        throw error;
      }

      console.log('Fetched carousel images:', data);
      return data || [];
    },
    enabled: !!projectId,
  });
};