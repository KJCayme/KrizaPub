
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export const useAboutInfo = () => {
  return useQuery({
    queryKey: ['about-info'],
    queryFn: async () => {
      console.log('Fetching about info...');
      const { data, error } = await supabase
        .from('about_info')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching about info:', error);
        throw error;
      }
      console.log('About info fetched:', data);
      return data;
    },
  });
};

export const useUpdateAboutInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (info: string) => {
      console.log('Updating about info with:', info);
      
      // First try to get existing record
      const { data: existingData, error: fetchError } = await supabase
        .from('about_info')
        .select('id')
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking existing data:', fetchError);
        throw new Error(`Failed to check existing data: ${fetchError.message}`);
      }

      if (existingData) {
        // Update existing record
        console.log('Updating existing record with id:', existingData.id);
        const { data, error } = await supabase
          .from('about_info')
          .update({ info })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating existing record:', error);
          throw new Error(`Failed to update: ${error.message}`);
        }
        console.log('Updated record:', data);
        return data;
      } else {
        // Insert new record
        console.log('Inserting new record');
        const { data, error } = await supabase
          .from('about_info')
          .insert({ info })
          .select()
          .single();
        
        if (error) {
          console.error('Error inserting new record:', error);
          throw new Error(`Failed to insert: ${error.message}`);
        }
        console.log('Inserted record:', data);
        return data;
      }
    },
    onSuccess: (data) => {
      console.log('Successfully updated about info:', data);
      queryClient.invalidateQueries({ queryKey: ['about-info'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
};
