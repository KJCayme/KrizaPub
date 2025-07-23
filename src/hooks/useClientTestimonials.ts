
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGenerateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('generate_random_code');
      if (error) throw error;
      
      const code = data as string;
      
      // Insert a new row with the generated code
      const { error: insertError } = await supabase
        .from('client_testimonials')
        .insert({ code });
      
      if (insertError) throw insertError;
      
      return code;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-testimonials'] });
      toast.success('Code generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating code:', error);
      toast.error('Failed to generate code. Please try again.');
    },
  });
};

export const useUpdateClientTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: {
      code: string;
      name: string;
      email: string;
      company: string;
      feedback: string;
      rate: number;
      image?: string;
      feedback_picture?: string;
      name_censored?: boolean;
      email_censored?: boolean;
      company_censored?: boolean;
    }) => {
      const { error } = await supabase
        .from('client_testimonials')
        .update({
          name: testimonial.name,
          email: testimonial.email,
          company: testimonial.company,
          feedback: testimonial.feedback,
          rate: testimonial.rate,
          image: testimonial.image,
          feedback_picture: testimonial.feedback_picture,
          name_censored: testimonial.name_censored || false,
          email_censored: testimonial.email_censored || false,
          company_censored: testimonial.company_censored || false,
        })
        .eq('code', testimonial.code);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Client testimonial updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating client testimonial:', error);
      toast.error('Failed to update testimonial. Please check your code and try again.');
    },
  });
};
