
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, source }: { id: number; source: 'testimonials' | 'client_testimonials' }) => {
      console.log('Deleting testimonial:', id, 'from', source);
      
      const { error } = await supabase
        .from(source)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
      }

      return { id, source };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete testimonial:', error);
      toast.error('Failed to delete testimonial. Please try again.');
    },
  });
};
