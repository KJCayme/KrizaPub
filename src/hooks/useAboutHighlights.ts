
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useAboutHighlights = () => {
  return useQuery({
    queryKey: ['about-highlights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_hl')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAboutHighlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, icon, title, description }: { id: number; icon: string; title: string; description: string }) => {
      const { data, error } = await supabase
        .from('about_hl')
        .update({ icon, title, description })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-highlights'] });
    },
  });
};
