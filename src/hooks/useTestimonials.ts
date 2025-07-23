
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Testimonial {
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
  user_id: string | null;
  created_at: string;
}

// Utility function to censor text
const censorText = (text: string): string => {
  if (!text || text.length <= 2) return text;
  
  if (text.includes('@')) {
    // Email censoring
    const [localPart, domain] = text.split('@');
    if (localPart.length <= 2) return text;
    const visibleChars = Math.min(2, localPart.length - 1);
    const censoredLocal = localPart.substring(0, visibleChars) + '*'.repeat(localPart.length - visibleChars);
    return `${censoredLocal}@${domain}`;
  } else {
    // Regular text censoring
    const visibleChars = Math.min(2, text.length - 1);
    return text.substring(0, visibleChars) + '*'.repeat(text.length - visibleChars);
  }
};

export const useTestimonials = (limit?: number) => {
  return useQuery({
    queryKey: ['testimonials', limit],
    queryFn: async () => {
      console.log('Fetching testimonials...', limit ? `(limit: ${limit})` : '(all)');
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      console.log('Fetched testimonials:', data);
      
      // Apply censoring to the data
      const processedData = data.map(testimonial => ({
        ...testimonial,
        name: testimonial.name_censored && testimonial.name ? censorText(testimonial.name) : testimonial.name,
        company: testimonial.company_censored && testimonial.company ? censorText(testimonial.company) : testimonial.company,
        email: testimonial.email_censored && testimonial.email ? censorText(testimonial.email) : testimonial.email,
      }));
      
      return processedData as Testimonial[];
    },
  });
};

export const useAddTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonialData: {
      name?: string;
      name_censored?: boolean;
      company?: string;
      company_censored?: boolean;
      email?: string;
      email_censored?: boolean;
      rate: number;
      feedback: string;
      image?: string;
      feedback_picture?: string;
    }) => {
      console.log('Adding testimonial:', testimonialData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to add testimonials');
      }

      const { data, error } = await supabase
        .from('testimonials')
        .insert([
          {
            ...testimonialData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding testimonial:', error);
        throw error;
      }

      console.log('Added testimonial:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial added successfully!');
    },
    onError: (error) => {
      console.error('Failed to add testimonial:', error);
      toast.error('Failed to add testimonial. Please try again.');
    },
  });
};
