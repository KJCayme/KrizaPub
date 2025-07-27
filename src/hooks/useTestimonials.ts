
import React from 'react';
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
  source: 'testimonials' | 'client_testimonials';
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
      console.log('Fetching testimonials from both tables...', limit ? `(limit: ${limit})` : '(all)');
      
      // Fetch from testimonials table
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (testimonialsError) {
        console.error('Error fetching testimonials:', testimonialsError);
        throw testimonialsError;
      }

      // Fetch from client_testimonials table
      const { data: clientTestimonialsData, error: clientTestimonialsError } = await supabase
        .from('client_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientTestimonialsError) {
        console.error('Error fetching client testimonials:', clientTestimonialsError);
        throw clientTestimonialsError;
      }

      // Filter out client testimonials with empty or null feedback
      const filteredClientTestimonials = clientTestimonialsData.filter(item => 
        item.feedback && item.feedback.trim() !== ''
      );

      // Combine and normalize data
      const normalizedTestimonials = testimonialsData.map(item => ({
        ...item,
        source: 'testimonials' as const
      }));

      const normalizedClientTestimonials = filteredClientTestimonials.map(item => ({
        ...item,
        source: 'client_testimonials' as const
      }));

      // Combine both arrays
      const allTestimonials = [...normalizedTestimonials, ...normalizedClientTestimonials];

      // Sort by created_at date (latest first)
      allTestimonials.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Apply limit if specified
      const limitedTestimonials = limit ? allTestimonials.slice(0, limit) : allTestimonials;

      console.log('Fetched combined testimonials:', limitedTestimonials);
      
      // Apply censoring to the data
      const processedData = limitedTestimonials.map(testimonial => ({
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
