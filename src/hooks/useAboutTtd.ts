
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useAboutTtd = () => {
  return useQuery({
    queryKey: ['about-ttd'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_ttd')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAboutTtd = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, icon, title, description }: { id: number; icon: string; title: string; description: string }) => {
      const { data, error } = await supabase
        .from('about_ttd')
        .update({ icon, title, description })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-ttd'] });
    },
  });
};

export const useAddAboutTtd = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ icon, title, description }: { icon: string; title: string; description: string }) => {
      const { data, error } = await supabase
        .from('about_ttd')
        .insert({ icon, title, description })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-ttd'] });
    },
  });
};

export const useDeleteAboutTtd = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('about_ttd')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-ttd'] });
    },
  });
};
