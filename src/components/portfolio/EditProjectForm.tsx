import React, { useState, useEffect } from 'react';
import { Upload, Loader2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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

interface CarouselImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
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
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [newCarouselImage, setNewCarouselImage] = useState('');
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: categoriesData } = usePortfolioCategories();
  const categories = categoriesData || [];

  // Fetch carousel images for this project
  const { data: carouselImagesData, refetch: refetchCarouselImages } = useQuery({
    queryKey: ['carousel-images', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_carousel_images')
        .select('*')
        .eq('project_id', project.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: isOpen && !!project.id,
  });

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

  // Initialize carousel images when data is fetched
  useEffect(() => {
    if (carouselImagesData) {
      setCarouselImages(carouselImagesData);
    }
  }, [carouselImagesData]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Updating project with data:', data);
      
      const { error } = await supabase
        .from('projects')
        .update({
          title: data.title,
          category: data.category,
          months: data.months,
          caption: data.caption,
          results: data.results,
          skills_used: data.skills_used,
          project_card_image: data.project_card_image,
          link: data.link || null,
          problem: data.problem || null,
          solution: data.solution || null,
          detailed_process: data.detailed_process || null,
          detailed_results: data.detailed_results || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      
      console.log('Project updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', project.category] });
      toast.success('Project updated successfully!');
      onProjectUpdated?.();
      onClose();
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    },
  });

  const addCarouselImageMutation = useMutation({
    mutationFn: async ({ imageUrl, altText }: { imageUrl: string; altText: string }) => {
      const maxSortOrder = Math.max(...carouselImages.map(img => img.sort_order), -1);
      
      const { error } = await supabase
        .from('project_carousel_images')
        .insert({
          project_id: project.id,
          image_url: imageUrl,
          alt_text: altText,
          sort_order: maxSortOrder + 1,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      refetchCarouselImages();
      setNewCarouselImage('');
      toast.success('Carousel image added successfully!');
    },
    onError: (error) => {
      console.error('Error adding carousel image:', error);
      toast.error('Failed to add carousel image. Please try again.');
    },
  });

  const deleteCarouselImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('project_carousel_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      refetchCarouselImages();
      toast.success('Carousel image removed successfully!');
    },
    onError: (error) => {
      console.error('Error deleting carousel image:', error);
      toast.error('Failed to remove carousel image. Please try again.');
    },
  });

  const handleImageUpload = async (file: File, isCarousel = false) => {
    const setUploading = isCarousel ? setIsUploadingCarousel : setIsUploading;
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = isCarousel ? `carousel/${fileName}` : `project-cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      if (isCarousel) {
        setNewCarouselImage(publicUrl);
      } else {
        setFormData(prev => ({ ...prev, project_card_image: publicUrl }));
      }
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
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

  const handleAddCarouselImage = () => {
    if (newCarouselImage.trim()) {
      addCarouselImageMutation.mutate({
        imageUrl: newCarouselImage.trim(),
        altText: `${formData.title} - Carousel Image`,
      });
    }
  };

  const handleDeleteCarouselImage = (imageId: string) => {
    deleteCarouselImageMutation.mutate(imageId);
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

          {/* Carousel Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Carousel Images</h3>
            
            <div className="space-y-2">
              <Label htmlFor="new_carousel_image">Add Carousel Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="new_carousel_image"
                  value={newCarouselImage}
                  onChange={(e) => setNewCarouselImage(e.target.value)}
                  placeholder="Image URL"
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploadingCarousel}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingCarousel}
                    className="flex items-center gap-2"
                  >
                    {isUploadingCarousel ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={handleAddCarouselImage}
                  disabled={!newCarouselImage.trim() || addCarouselImageMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {addCarouselImageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add
                </Button>
              </div>
            </div>

            {/* Display existing carousel images */}
            {carouselImages.length > 0 && (
              <div className="space-y-2">
                <Label>Current Carousel Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {carouselImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || 'Carousel image'}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCarouselImage(image.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={deleteCarouselImageMutation.isPending}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
