
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCategoryActions = () => {
  const queryClient = useQueryClient();

  const toggleCategoryVisibility = useMutation({
    mutationFn: async ({ categoryId, hidden }: { categoryId: string; hidden: boolean }) => {
      const { error } = await supabase
        .from('port_skill_cat')
        .update({ hidden })
        .eq('id', categoryId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both hidden and visible category queries
      queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
      toast.success('Category visibility updated');
    },
    onError: (error) => {
      console.error('Error updating category visibility:', error);
      toast.error('Failed to update category visibility');
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ categoryId, name, badge }: { categoryId: string; name: string; badge?: string }) => {
      const { error } = await supabase
        .from('port_skill_cat')
        .update({ name, badge })
        .eq('id', categoryId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
      toast.success('Category updated');
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('port_skill_cat')
        .delete()
        .eq('id', categoryId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
      toast.success('Category deleted');
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    },
  });

  return {
    toggleCategoryVisibility,
    updateCategory,
    deleteCategory,
  };
};
