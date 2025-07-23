
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useAboutHobbies = () => {
  return useQuery({
    queryKey: ['about-hobbies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_hobbies')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAboutHobby = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, icon, title, description }: { id: number; icon: string; title: string; description: string }) => {
      const { data, error } = await supabase
        .from('about_hobbies')
        .update({ icon, title, description })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-hobbies'] });
    },
  });
};
