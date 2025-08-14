
import React, { useState, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioCategories } from '@/hooks/usePortfolioCategories';
import { toast } from 'sonner';
import type { Project } from '@/hooks/useProjects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onProjectUpdated?: () => void;
}

const EditProjectForm = ({ isOpen, onClose, project, onProjectUpdated }: EditProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    months: '',
    caption: '',
    results: '',
    skills_used: '',
    project_card_image: '',
    link: '',
    problem: '',
    solution: '',
    detailed_process: '',
    detailed_results: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: categoriesData } = usePortfolioCategories();
  const categories = categoriesData || [];

  // Initialize form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        category: project.category || '',
        months: project.months || '',
        caption: project.caption || '',
        results: project.results || '',
        skills_used: project.skills_used || '',
        project_card_image: project.project_card_image || '',
        link: project.link || '',
        problem: project.problem || '',
        solution: project.solution || '',
        detailed_process: project.detailed_process || '',
        detailed_results: project.detailed_results || '',
      });
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', project.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully!');
      onProjectUpdated?.();
      onClose();
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    },
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `project-cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, project_card_image: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.category_key}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="months">Duration *</Label>
              <Input
                id="months"
                name="months"
                value={formData.months}
                onChange={handleInputChange}
                placeholder="e.g., 3 months"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Live Link (Optional)</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_card_image">Project Card Image *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="project_card_image"
                name="project_card_image"
                type="url"
                value={formData.project_card_image}
                onChange={handleInputChange}
                placeholder="Image URL"
                required
                className="flex-1"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload
                </Button>
              </div>
            </div>
            {formData.project_card_image && (
              <img
                src={formData.project_card_image}
                alt="Preview"
                className="mt-2 w-32 h-20 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Description *</Label>
            <Textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results *</Label>
            <Textarea
              id="results"
              name="results"
              value={formData.results}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills_used">Skills Used *</Label>
            <Input
              id="skills_used"
              name="skills_used"
              value={formData.skills_used}
              onChange={handleInputChange}
              placeholder="Comma-separated skills"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Optional Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement</Label>
              <Textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailed_process">Detailed Process</Label>
              <Textarea
                id="detailed_process"
                name="detailed_process"
                value={formData.detailed_process}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailed_results">Detailed Results</Label>
              <Textarea
                id="detailed_results"
                name="detailed_results"
                value={formData.detailed_results}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProjectMutation.isPending}
              className="flex-1"
            >
              {updateProjectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectForm;
