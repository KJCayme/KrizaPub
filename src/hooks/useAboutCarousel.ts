
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAboutCarousel = () => {
  return useQuery({
    queryKey: ['about-carousel'],
    queryFn: async () => {
      console.log('Fetching about carousel images');
      const { data, error } = await supabase
        .from('about_carousel')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching about carousel images:', error);
        throw error;
      }

      console.log('Fetched about carousel images:', data);
      return data || [];
    },
  });
};
