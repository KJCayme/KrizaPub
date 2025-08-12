
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { usePortfolioCategories } from '../../hooks/usePortfolioCategories';

// Create a dynamic schema that makes link optional for funnel and web categories
const createProjectSchema = (category: string) => z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  caption: z.string().min(1, 'Caption is required'),
  results: z.string().min(1, 'Results are required'),
  skills_used: z.string().min(1, 'Skills used are required'),
  months: z.string().min(1, 'Duration is required'),
  detailed_process: z.string().optional(),
  detailed_results: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  project_card_image: z.any().refine((files) => files?.length > 0, 'Project card image is required'),
  link: category === 'funnel' || category === 'web' 
    ? z.string().optional() 
    : z.string().min(1, 'Live link is required'),
  image_link: z.string().optional(),
});

interface AddProjectFormProps {
  onClose: () => void;
}

const AddProjectForm = ({ onClose }: AddProjectFormProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [watchedCategory, setWatchedCategory] = useState<string>('');
  const queryClient = useQueryClient();
  const { data: categories = [] } = usePortfolioCategories();

  // Create form with dynamic schema
  const form = useForm({
    resolver: zodResolver(createProjectSchema(watchedCategory)),
    defaultValues: {
      title: '',
      category: '',
      caption: '',
      results: '',
      skills_used: '',
      months: '',
      detailed_process: '',
      detailed_results: '',
      problem: '',
      solution: '',
      link: '',
      image_link: '',
    },
  });

  // Watch category changes to update validation
  const category = form.watch('category');
  React.useEffect(() => {
    if (category !== watchedCategory) {
      setWatchedCategory(category);
      // Re-create the form with new schema
      form.clearErrors();
    }
  }, [category, watchedCategory, form]);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const addProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.category] });
      toast.success('Project added successfully!');
      onClose();
    },
    onError: (error) => {
      console.error('Error adding project:', error);
      toast.error('Failed to add project. Please try again.');
    },
  });

  const onSubmit = async (data: any) => {
    try {
      let projectCardImageUrl = '';
      let carouselImageUrls: string[] = [];

      // Upload project card image
      if (data.project_card_image?.[0]) {
        const timestamp = Date.now();
        const fileName = `project_card_${timestamp}_${data.project_card_image[0].name}`;
        projectCardImageUrl = await uploadFile(data.project_card_image[0], `projects/cards/${fileName}`);
      }

      // Upload carousel images
      if (selectedImages.length > 0) {
        const timestamp = Date.now();
        const uploadPromises = selectedImages.map((file, index) => {
          const fileName = `carousel_${timestamp}_${index}_${file.name}`;
          return uploadFile(file, `projects/carousel/${fileName}`);
        });
        carouselImageUrls = await Promise.all(uploadPromises);
      }

      const projectData = {
        title: data.title,
        category: data.category,
        caption: data.caption,
        results: data.results,
        skills_used: data.skills_used,
        months: data.months,
        detailed_process: data.detailed_process || '',
        detailed_results: data.detailed_results || '',
        problem: data.problem || '',
        solution: data.solution || '',
        project_card_image: projectCardImageUrl,
        link: data.link || '',
        image_link: carouselImageUrls.length > 0 ? carouselImageUrls.join(',') : '',
      };

      await addProjectMutation.mutateAsync(projectData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to add project. Please try again.');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const isLinkOptional = category === 'funnel' || category === 'web';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Project</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.category_key}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the project" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="results"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Results</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What were the outcomes?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills_used"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills Used</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Technologies, tools, methodologies used" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3 months, 2 weeks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Live Link {isLinkOptional && <span className="text-gray-500">(Optional)</span>}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isLinkOptional ? "https://example.com (optional)" : "https://example.com"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What problem did this project solve?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solution (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How did you solve it?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="detailed_process"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Process (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the process" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detailed_results"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Results (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the results" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="project_card_image"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Project Card Image *</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                      value={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Carousel Images (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="flex-1"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              
              {selectedImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected images ({selectedImages.length}):
                  </p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={addProjectMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addProjectMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {addProjectMutation.isPending ? 'Adding...' : 'Add Project'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProjectForm;
