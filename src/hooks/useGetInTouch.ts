import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GetInTouchData {
  id?: string;
  icon: string;
  social: string;
  caption: string;
  sort_order: number;
}

export const useGetInTouch = () => {
  return useQuery({
    queryKey: ['get-in-touch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('get_in_touch')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data as GetInTouchData[];
    },
  });
};

export const useUpdateGetInTouch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: GetInTouchData[]) => {
      // Delete all existing records first
      await supabase.from('get_in_touch').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new records
      const { error } = await supabase.from('get_in_touch').insert(
        items.map((item, index) => ({
          icon: item.icon,
          social: item.social,
          caption: item.caption,
          sort_order: index,
        }))
      );
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-in-touch'] });
      toast.success('Get in touch information updated successfully');
    },
    onError: (error) => {
      console.error('Error updating get in touch:', error);
      toast.error('Failed to update get in touch information');
    },
  });
};