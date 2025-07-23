
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PortfolioCategory {
  id: string;
  name: string;
  category_key: string;
  badge?: string;
  hidden?: boolean;
}

export const usePortfolioCategories = (showHidden = false) => {
  return useQuery({
    queryKey: ['portfolio-categories', showHidden],
    queryFn: async () => {
      console.log('Fetching portfolio categories from database...');
      let query = supabase
        .from('port_skill_cat')
        .select('*');
      
      if (!showHidden) {
        query = query.eq('hidden', false);
      }
      
      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching portfolio categories:', error);
        throw error;
      }

      console.log('Fetched portfolio categories:', data);
      
      // Sort categories: visible first, then hidden, then alphabetically within each group
      const sortedData = (data || []).sort((a, b) => {
        // First sort by visibility (visible first)
        if (a.hidden !== b.hidden) {
          return a.hidden ? 1 : -1;
        }
        // Then sort alphabetically by name
        return a.name.localeCompare(b.name);
      });

      return sortedData as PortfolioCategory[];
    },
  });
};
