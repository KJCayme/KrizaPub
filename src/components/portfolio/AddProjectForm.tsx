
import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAuth } from '../../hooks/useAuth';
import { useAddProject, useUpdateProject, useDeleteProject, useProjects, type Project } from '../../hooks/useProjects';
import { usePortfolioCategories } from '../../hooks/usePortfolioCategories';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded?: () => void;
}

const AddProjectForm = ({ isOpen, onClose, onProjectAdded }: AddProjectFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: categories = [] } = usePortfolioCategories();
  const { data: projects = [] } = useProjects();
  const addProjectMutation = useAddProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    caption: '',
    months: '',
    link: '',
    skills_used: '',
    results: '',
    project_card_image: '',
    image_link: '',
    problem: '',
    solution: '',
    detailed_process: '',
    detailed_results: ''
  });

  // Check if Live Link should be optional based on category
  const isLiveLinkOptional = formData.category === 'Funnel Design' || formData.category === 'Web Design';

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        category: editingProject.category || '',
        caption: editingProject.caption || '',
        months: editingProject.months || '',
        link: editingProject.link || '',
        skills_used: editingProject.skills_used || '',
        results: editingProject.results || '',
        project_card_image: editingProject.project_card_image || '',
        image_link: editingProject.image_link || '',
        problem: editingProject.problem || '',
        solution: editingProject.solution || '',
        detailed_process: editingProject.detailed_process || '',
        detailed_results: editingProject.detailed_results || ''
      });
    } else {
      setFormData({
        title: '',
        category: '',
        caption: '',
        months: '',
        link: '',
        skills_used: '',
        results: '',
        project_card_image: '',
        image_link: '',
        problem: '',
        solution: '',
        detailed_process: '',
        detailed_results: ''
      });
    }
  }, [editingProject]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'project_card_image' | 'image_link') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      handleInputChange(field, publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const projectData = {
        ...formData,
        user_id: user.id
      };

      if (editingProject) {
        await updateProjectMutation.mutateAsync({
          id: editingProject.id,
          updates: projectData
        });
        setEditingProject(null);
      } else {
        await addProjectMutation.mutateAsync(projectData);
      }
      
      setFormData({
        title: '',
        category: '',
        caption: '',
        months: '',
        link: '',
        skills_used: '',
        results: '',
        project_card_image: '',
        image_link: '',
        problem: '',
        solution: '',
        detailed_process: '',
        detailed_results: ''
      });
      
      if (onProjectAdded) {
        onProjectAdded();
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleDelete = async (projectId: string) => {
    if (!user) return;
    
    try {
      await deleteProjectMutation.mutateAsync(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: '',
      caption: '',
      months: '',
      link: '',
      skills_used: '',
      results: '',
      project_card_image: '',
      image_link: '',
      problem: '',
      solution: '',
      detailed_process: '',
      detailed_results: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            {editingProject ? 'Edit Project' : 'Add New Project'}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Project Form */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingProject ? 'Edit Project Details' : 'Project Details'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., E-commerce Website Redesign"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-slate-300">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.category_key} className="text-white">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="months" className="text-slate-300">Duration *</Label>
                  <Input
                    id="months"
                    value={formData.months}
                    onChange={(e) => handleInputChange('months', e.target.value)}
                    placeholder="e.g., 3 months"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="link" className="text-slate-300">
                    Live Link {isLiveLinkOptional ? '(optional)' : '*'}
                  </Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://example.com"
                    required={!isLiveLinkOptional}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="caption" className="text-slate-300">Short Description *</Label>
                  <Textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => handleInputChange('caption', e.target.value)}
                    placeholder="Brief description of the project"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="skills_used" className="text-slate-300">Skills Used *</Label>
                  <Input
                    id="skills_used"
                    value={formData.skills_used}
                    onChange={(e) => handleInputChange('skills_used', e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, etc."
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">Separate skills with commas</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="results" className="text-slate-300">Results Achieved *</Label>
                  <Textarea
                    id="results"
                    value={formData.results}
                    onChange={(e) => handleInputChange('results', e.target.value)}
                    placeholder="What was accomplished or delivered"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                {/* Project Card Image Upload */}
                <div className="md:col-span-2">
                  <Label className="text-slate-300">Project Card Image *</Label>
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                        {formData.project_card_image ? (
                          <div className="space-y-2">
                            <img 
                              src={formData.project_card_image} 
                              alt="Project card preview" 
                              className="w-full max-w-md mx-auto rounded-lg"
                            />
                            <p className="text-slate-400 text-sm">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                            <p className="text-slate-400">Click to upload project card image</p>
                            <p className="text-xs text-slate-500">Recommended: 800x600px or similar aspect ratio</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'project_card_image')}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Optional Project Link Image Upload */}
                <div className="md:col-span-2">
                  <Label className="text-slate-300">Additional Project Image (optional)</Label>
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                        {formData.image_link ? (
                          <div className="space-y-2">
                            <img 
                              src={formData.image_link} 
                              alt="Additional project preview" 
                              className="w-full max-w-md mx-auto rounded-lg"
                            />
                            <p className="text-slate-400 text-sm">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                            <p className="text-slate-400">Click to upload additional image (optional)</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image_link')}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Optional Problem Statement */}
                <div className="md:col-span-2">
                  <Label htmlFor="problem" className="text-slate-300">Problem Statement (optional)</Label>
                  <Textarea
                    id="problem"
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    placeholder="What problem did this project solve?"
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                {/* Optional Solution Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="solution" className="text-slate-300">Solution Description (optional)</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="How did you solve the problem?"
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                {/* Optional Detailed Process */}
                <div className="md:col-span-2">
                  <Label htmlFor="detailed_process" className="text-slate-300">Detailed Process (optional)</Label>
                  <Textarea
                    id="detailed_process"
                    value={formData.detailed_process}
                    onChange={(e) => handleInputChange('detailed_process', e.target.value)}
                    placeholder="Detailed description of the process and methodology"
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>

                {/* Optional Detailed Results */}
                <div className="md:col-span-2">
                  <Label htmlFor="detailed_results" className="text-slate-300">Detailed Results (optional)</Label>
                  <Textarea
                    id="detailed_results"
                    value={formData.detailed_results}
                    onChange={(e) => handleInputChange('detailed_results', e.target.value)}
                    placeholder="Detailed description of results, metrics, and impact"
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={addProjectMutation.isPending || updateProjectMutation.isPending || isUploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {editingProject 
                    ? (updateProjectMutation.isPending ? 'Updating...' : 'Update Project')
                    : (addProjectMutation.isPending ? 'Adding...' : 'Add Project')
                  }
                </Button>
                
                {editingProject && (
                  <Button 
                    type="button"
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Projects List */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Existing Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-700 p-4 rounded-lg border border-slate-600"
                >
                  <div className="space-y-3">
                    {project.project_card_image && (
                      <img 
                        src={project.project_card_image} 
                        alt={project.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h4 className="text-white font-medium">{project.title}</h4>
                      <p className="text-xs text-slate-400 mb-2">{project.category}</p>
                      <p className="text-sm text-slate-300 line-clamp-2">{project.caption}</p>
                    </div>
                    <div className="flex gap-2">
                      {project.link && (
                        <Button
                          onClick={() => window.open(project.link, '_blank')}
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                      {user && user.id === project.user_id && (
                        <>
                          <Button
                            onClick={() => handleEdit(project)}
                            variant="ghost"
                            size="sm"
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(project.id)}
                            variant="ghost"
                            size="sm"
                            disabled={deleteProjectMutation.isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectForm;
