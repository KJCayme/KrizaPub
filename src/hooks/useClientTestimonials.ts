
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const uploadFile = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio')
    .getPublicUrl(data.path);

  return publicUrl;
};

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
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
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
      name?: string;
      email?: string;
      company?: string;
      feedback: string;
      rate: number;
      image?: File | string;
      feedback_picture?: File | string;
      name_censored?: boolean;
      email_censored?: boolean;
      company_censored?: boolean;
    }) => {
      let imageUrl = '';
      let feedbackPictureUrl = '';

      // Handle image upload
      if (testimonial.image instanceof File) {
        const imagePath = `testimonials/profile/${testimonial.code}_${Date.now()}_${testimonial.image.name}`;
        imageUrl = await uploadFile(testimonial.image, imagePath);
      } else if (typeof testimonial.image === 'string') {
        imageUrl = testimonial.image;
      }

      // Handle feedback picture upload
      if (testimonial.feedback_picture instanceof File) {
        const feedbackPath = `testimonials/feedback/${testimonial.code}_${Date.now()}_${testimonial.feedback_picture.name}`;
        feedbackPictureUrl = await uploadFile(testimonial.feedback_picture, feedbackPath);
      } else if (typeof testimonial.feedback_picture === 'string') {
        feedbackPictureUrl = testimonial.feedback_picture;
      }

      const { error } = await supabase
        .from('client_testimonials')
        .update({
          name: testimonial.name || null,
          email: testimonial.email || null,
          company: testimonial.company || null,
          feedback: testimonial.feedback,
          rate: testimonial.rate,
          image: imageUrl || null,
          feedback_picture: feedbackPictureUrl || null,
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
