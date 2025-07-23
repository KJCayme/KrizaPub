
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientTestimonial {
  id: number;
  name: string | null;
  company: string | null;
  rate: number | null;
  feedback: string | null;
  image: string | null;
  feedback_picture: string | null;
  email: string | null;
  email_censored: boolean | null;
  name_censored: boolean | null;
  company_censored: boolean | null;
  caption: string | null;
  code: string | null;
  created_at: string;
}

export const useClientTestimonials = () => {
  return useQuery({
    queryKey: ['client-testimonials'],
    queryFn: async () => {
      console.log('Fetching client testimonials...');
      const { data, error } = await supabase
        .from('client_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client testimonials:', error);
        throw error;
      }

      console.log('Fetched client testimonials:', data);
      return data as ClientTestimonial[];
    },
  });
};

export const useGenerateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Generating code and creating client testimonial...');
      
      const { data, error } = await supabase.rpc('generate_random_code');
      
      if (error) {
        console.error('Error generating code:', error);
        throw error;
      }

      const code = data as string;
      
      // Insert new client testimonial with the generated code
      const { data: testimonialData, error: insertError } = await supabase
        .from('client_testimonials')
        .insert([{ code }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating client testimonial:', insertError);
        throw insertError;
      }

      console.log('Created client testimonial with code:', testimonialData);
      return { code, testimonial: testimonialData };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-testimonials'] });
      toast.success('Code generated successfully!');
    },
    onError: (error) => {
      console.error('Failed to generate code:', error);
      toast.error('Failed to generate code. Please try again.');
    },
  });
};

export const useUpdateClientTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      code: string;
      name?: string;
      company?: string;
      email?: string;
      rate: number;
      feedback: string;
      image?: string;
      feedback_picture?: string;
      name_censored?: boolean;
      company_censored?: boolean;
      email_censored?: boolean;
    }) => {
      console.log('Updating client testimonial with code:', data.code);
      
      const { data: testimonialData, error } = await supabase
        .from('client_testimonials')
        .update({
          name: data.name || null,
          company: data.company || null,
          email: data.email || null,
          rate: data.rate,
          feedback: data.feedback,
          image: data.image || null,
          feedback_picture: data.feedback_picture || null,
          name_censored: data.name_censored || false,
          company_censored: data.company_censored || false,
          email_censored: data.email_censored || false,
        })
        .eq('code', data.code)
        .select()
        .single();

      if (error) {
        console.error('Error updating client testimonial:', error);
        throw error;
      }

      console.log('Updated client testimonial:', testimonialData);
      return testimonialData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-testimonials'] });
      toast.success('Client testimonial updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update client testimonial:', error);
      toast.error('Failed to update testimonial. Please check your code and try again.');
    },
  });
};
