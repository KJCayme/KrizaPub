
import React from 'react';
import { Calendar, Users, TrendingUp, Palette, Code, Bot, PenTool, Database, Globe, BarChart3, FileText, Video } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import type { Project } from '@/hooks/useProjects';

// Icon mapping for different categories
const getCategoryIcon = (category: string): React.ReactNode => {
  switch (category) {
    case 'admin':
      return <Calendar className="w-6 h-6" />;
    case 'social':
      return <Users className="w-6 h-6" />;
    case 'project':
      return <TrendingUp className="w-6 h-6" />;
    case 'design':
      return <Palette className="w-6 h-6" />;
    case 'copywriting':
      return <PenTool className="w-6 h-6" />;
    case 'webdev':
      return <Code className="w-6 h-6" />;
    case 'ai':
      return <Bot className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
};

// Transform database project to UI project format
export const transformProject = (dbProject: Tables<'projects'>): Project => {
  return {
    ...dbProject,
    // Map database fields to expected UI fields
    description: dbProject.caption,
    image: dbProject.project_card_image,
    tags: dbProject.skills_used ? dbProject.skills_used.split(', ') : [],
    duration: dbProject.months,
    icon: getCategoryIcon(dbProject.category),
    detailedProcess: dbProject.detailed_process || undefined,
    detailedResults: dbProject.detailed_results || undefined,
  };
};

// Transform multiple projects
export const transformProjects = (dbProjects: Tables<'projects'>[]): Project[] => {
  return dbProjects.map(transformProject);
};
