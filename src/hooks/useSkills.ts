import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Skill {
  id: string;
  skill_name: string;
  description?: string;
  icon?: string;
  badge?: string;
  color?: string;
  keyservice_id?: number;
  hidden?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillExpertise {
  id: string;
  skill_id: string;
  expertise_level: string;
  years_experience: number;
  details?: string[];
  created_at: string;
  updated_at: string;
}

export const useSkills = (showHidden: boolean = false) => {
  return useQuery({
    queryKey: ['skills', showHidden],
    queryFn: async () => {
      let query = supabase
        .from('skills_main')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!showHidden) {
        query = query.eq('hidden', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Skill[];
    },
  });
};

export const useAllSkills = () => {
  return useQuery({
    queryKey: ['all-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills_main')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
  });
};

export const useSkillsWithExpertise = (showHidden: boolean = false) => {
  return useQuery({
    queryKey: ['skills-with-expertise', showHidden],
    queryFn: async () => {
      let query = supabase
        .from('skills_main')
        .select(`
          *,
          skills_expertise (
            id,
            expertise_level,
            years_experience,
            details
          )
        `)
        .order('created_at', { ascending: true });
      
      if (!showHidden) {
        query = query.eq('hidden', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (skillData: {
      skill_name: string;
      description?: string;
      icon?: string;
      badge?: string;
      color?: string;
      details?: string[];
    }) => {
      const { data, error } = await supabase
        .from('skills_main')
        .insert([{
          skill_name: skillData.skill_name,
          description: skillData.description || `Professional ${skillData.skill_name} services`,
          icon: skillData.icon || 'Star',
          badge: skillData.badge,
          color: skillData.color || 'from-blue-500 to-cyan-500'
        }])
        .select()
        .single();
      
      if (error) throw error;

      // If details are provided, update the skills_expertise table
      if (skillData.details && skillData.details.length > 0) {
        const { error: expertiseError } = await supabase
          .from('skills_expertise')
          .update({ details: skillData.details })
          .eq('skill_id', data.id);
        
        if (expertiseError) throw expertiseError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['all-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-with-expertise'] });
      toast.success('Skill added successfully!');
    },
    onError: (error) => {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await supabase
        .from('skills_main')
        .delete()
        .eq('id', skillId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['all-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-with-expertise'] });
      toast.success('Skill deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    },
  });
};

export const useToggleSkillVisibility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ skillId, hidden }: { skillId: string; hidden: boolean }) => {
      const { error } = await supabase
        .from('skills_main')
        .update({ hidden })
        .eq('id', skillId);
      
      if (error) throw error;
    },
    onSuccess: (_, { hidden }) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['all-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-with-expertise'] });
      toast.success(hidden ? 'Skill hidden successfully!' : 'Skill shown successfully!');
    },
    onError: (error) => {
      console.error('Error toggling skill visibility:', error);
      toast.error('Failed to update skill visibility');
    },
  });
};
