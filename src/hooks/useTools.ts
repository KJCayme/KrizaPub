import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export interface Tool {
  id: string;
  name: string;
  category?: string;
  icon: string;
  color: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch all tools
export const useTools = () => {
  return useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching tools:', error);
        throw error;
      }

      return data as Tool[];
    },
  });
};

// Add new tool
export const useAddTool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>) => {
      const toolWithDefaults = {
        ...tool,
        category: tool.category || 'General'
      };
      
      const { data, error } = await supabase
        .from('tools')
        .insert([toolWithDefaults])
        .select()
        .single();

      if (error) {
        console.error('Error adding tool:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast({
        title: "Success",
        description: "Tool added successfully!",
      });
    },
    onError: (error) => {
      console.error('Add tool error:', error);
      toast({
        title: "Error",
        description: "Failed to add tool. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Update tool
export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tool> }) => {
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating tool:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast({
        title: "Success",
        description: "Tool updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Update tool error:', error);
      toast({
        title: "Error",
        description: "Failed to update tool. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Delete tool
export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tool:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast({
        title: "Success",
        description: "Tool deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Delete tool error:', error);
      toast({
        title: "Error",
        description: "Failed to delete tool. Please try again.",
        variant: "destructive",
      });
    },
  });
};