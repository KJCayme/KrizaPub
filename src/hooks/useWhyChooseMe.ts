import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WhyChooseMeData {
  id?: string;
  caption: string;
  sort_order: number;
}

export const useWhyChooseMe = () => {
  return useQuery({
    queryKey: ['why-choose-me'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('why_choose_me')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data as WhyChooseMeData[];
    },
  });
};

export const useUpdateWhyChooseMe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: WhyChooseMeData[]) => {
      // Delete all existing records first
      await supabase.from('why_choose_me').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new records
      const { error } = await supabase.from('why_choose_me').insert(
        items.map((item, index) => ({
          caption: item.caption,
          sort_order: index,
        }))
      );
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['why-choose-me'] });
      toast.success('Why choose me information updated successfully');
    },
    onError: (error) => {
      console.error('Error updating why choose me:', error);
      toast.error('Failed to update why choose me information');
    },
  });
};