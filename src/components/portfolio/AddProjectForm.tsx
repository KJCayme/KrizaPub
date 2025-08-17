
import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioCategories } from '@/hooks/usePortfolioCategories';
import { toast } from 'sonner';

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded?: () => void;
}

interface MediaFile {
  file: File;
  type: 'image' | 'video';
  thumbnail?: File;
}

const AddProjectForm = ({ isOpen, onClose, onProjectAdded }: AddProjectFormProps) => {
  const { user } = useAuth();
  const { data: categoriesData, isLoading: categoriesLoading } = usePortfolioCategories();
  
  const [formData, setFormData] = useState({
    title: '',
    months: '',
    caption: '',
    results: '',
    skills_used: '',
    category: '',
    problem: '',
    solution: '',
    detailed_process: '',
    detailed_results: '',
    link: ''
  });
  const [projectCardImage, setProjectCardImage] = useState<File | null>(null);
  const [carouselMedia, setCarouselMedia] = useState<MediaFile[]>([]);
  const [funnelImages, setFunnelImages] = useState<{
    desktop: File | null;
    tablet: File | null;
    mobile: File | null;
  }>({
    desktop: null,
    tablet: null,
    mobile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform categories data for the form
  const categories = categoriesData?.map(cat => ({
    value: cat.category_key,
    label: cat.name
  })) || [];

  const isFunnelCategory = formData.category === 'funnel' || formData.category === 'funnel-design';
  const isWebDevCategory = formData.category === 'webdev' || formData.category === 'web-development';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectCardImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectCardImage(e.target.files[0]);
    }
  };

  const handleCarouselMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newMedia = newFiles.map(file => ({
        file,
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setCarouselMedia(prev => [...prev, ...newMedia]);
    }
  };

  const handleFunnelImageChange = (device: 'desktop' | 'tablet' | 'mobile', file: File | null) => {
    setFunnelImages(prev => ({
      ...prev,
      [device]: file
    }));
  };

  const removeCarouselMedia = (index: number) => {
    setCarouselMedia(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    console.log(`Uploading file to ${bucket}/${path}`);
    console.log('Current user:', user?.id);
    
    try {
      // Verify session before upload
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error before upload:', sessionError);
        throw new Error('Authentication session expired. Please sign in again.');
      }
      
      console.log('Session verified for upload, uploading as user:', session.user.id);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { 
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Storage upload error:', error);
        console.error('Error details:', {
          message: error.message
        });
        throw error;
      }

      console.log('Upload successful:', data);
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      console.log('Generated public URL:', urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload function error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectCardImage) {
      toast.error('Please upload a project card image');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to add projects');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting project submission...');
      console.log('User ID:', user.id);
      
      // Verify current session before proceeding
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session expired. Please sign in again.');
      }
      
      console.log('Session verified, user authenticated:', session.user.id);
      
      // Upload project card image
      const cardImagePath = `cards/${Date.now()}-${projectCardImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const projectCardImageUrl = await uploadFile(projectCardImage, 'portfolio', cardImagePath);

      console.log('Card image uploaded, URL:', projectCardImageUrl);

      // Insert project into database with verified user session
      const projectData = {
        ...formData,
        link: formData.link || null,
        image_link: null,
        project_card_image: projectCardImageUrl,
        user_id: session.user.id, // Use session user ID to ensure consistency
      };
      
      console.log('Inserting project with data:', projectData);
      
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (projectError) {
        console.error('Project insert error:', projectError);
        console.error('Error details:', {
          message: projectError.message,
          details: projectError.details,
          hint: projectError.hint,
          code: projectError.code
        });
        throw projectError;
      }

      console.log('Project inserted successfully:', project);

      // Handle funnel images or regular carousel media
      if (isFunnelCategory && (funnelImages.desktop || funnelImages.tablet || funnelImages.mobile)) {
        console.log('Uploading funnel images...');
        
        const funnelUploads = [];
        let order = 0;

        if (funnelImages.desktop) {
          const imagePath = `carousel/${project.id}/desktop-${Date.now()}-${funnelImages.desktop.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const imageUrl = await uploadFile(funnelImages.desktop, 'portfolio', imagePath);
          
          funnelUploads.push({
            project_id: project.id,
            image_url: imageUrl,
            alt_text: `${project.title} desktop view`,
            sort_order: order++,
            media_type: 'image'
          });
        }

        if (funnelImages.tablet) {
          const imagePath = `carousel/${project.id}/tablet-${Date.now()}-${funnelImages.tablet.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const imageUrl = await uploadFile(funnelImages.tablet, 'portfolio', imagePath);
          
          funnelUploads.push({
            project_id: project.id,
            image_url: imageUrl,
            alt_text: `${project.title} tablet view`,
            sort_order: order++,
            media_type: 'image'
          });
        }

        if (funnelImages.mobile) {
          const imagePath = `carousel/${project.id}/mobile-${Date.now()}-${funnelImages.mobile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const imageUrl = await uploadFile(funnelImages.mobile, 'portfolio', imagePath);
          
          funnelUploads.push({
            project_id: project.id,
            image_url: imageUrl,
            alt_text: `${project.title} mobile view`,
            sort_order: order++,
            media_type: 'image'
          });
        }

        if (funnelUploads.length > 0) {
          const { error: carouselError } = await supabase
            .from('project_carousel_images')
            .insert(funnelUploads);

          if (carouselError) {
            console.error('Funnel images insert error:', carouselError);
            throw carouselError;
          }

          console.log('Funnel images uploaded successfully');
        }
      } else if (carouselMedia.length > 0) {
        console.log(`Uploading ${carouselMedia.length} carousel media files...`);
        
        const carouselUploads = await Promise.all(
          carouselMedia.map(async (media, index) => {
            const isVideo = media.type === 'video';
            const mediaPath = `carousel/${project.id}/${Date.now()}-${index}-${media.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const mediaUrl = await uploadFile(media.file, 'portfolio', mediaPath);
            
            let thumbnailUrl = null;
            if (isVideo && media.thumbnail) {
              const thumbnailPath = `carousel/${project.id}/thumbnail-${Date.now()}-${index}-${media.thumbnail.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
              thumbnailUrl = await uploadFile(media.thumbnail, 'portfolio', thumbnailPath);
            }
            
            return {
              project_id: project.id,
              image_url: mediaUrl,
              alt_text: `${project.title} ${isVideo ? 'video' : 'image'} ${index + 1}`,
              sort_order: index,
              media_type: isVideo ? 'video' : 'image',
              video_thumbnail_url: thumbnailUrl
            };
          })
        );

        const { error: carouselError } = await supabase
          .from('project_carousel_images')
          .insert(carouselUploads);

        if (carouselError) {
          console.error('Carousel media insert error:', carouselError);
          throw carouselError;
        }

        console.log('Carousel media uploaded successfully');
      }

      toast.success('Project added successfully!');
      onProjectAdded?.();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        months: '',
        caption: '',
        results: '',
        skills_used: '',
        category: '',
        problem: '',
        solution: '',
        detailed_process: '',
        detailed_results: '',
        link: ''
      });
      setProjectCardImage(null);
      setCarouselMedia([]);
      setFunnelImages({
        desktop: null,
        tablet: null,
        mobile: null
      });

    } catch (error) {
      console.error('Error adding project:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Please try again.';
      if (error.message?.includes('row-level security')) {
        errorMessage = 'Authentication error. Please sign out and sign in again.';
      } else if (error.message?.includes('session')) {
        errorMessage = 'Session expired. Please sign in again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Failed to add project: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show auth required dialog if form is open AND user is not authenticated
  if (isOpen && !user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <p className="text-center py-4">
            You need to be signed in to add projects.
          </p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't render anything if dialog is not open
  if (!isOpen) {
    return null;
  }

  // Show loading state if categories are still loading
  if (categoriesLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <p className="text-center py-4">
            Loading categories...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="months">Duration *</Label>
              <Input
                id="months"
                value={formData.months}
                onChange={(e) => handleInputChange('months', e.target.value)}
                placeholder="e.g., 3 months"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="caption">Caption *</Label>
            <Input
              id="caption"
              value={formData.caption}
              onChange={(e) => handleInputChange('caption', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="results">Results *</Label>
            <Input
              id="results"
              value={formData.results}
              onChange={(e) => handleInputChange('results', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="skills_used">{isFunnelCategory ? 'Technologies *' : 'Skills Used *'}</Label>
            <Input
              id="skills_used"
              value={formData.skills_used}
              onChange={(e) => handleInputChange('skills_used', e.target.value)}
              placeholder="Separate with commas"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Link field - Show for web development (optional) and funnel design categories (optional) */}
          {(isWebDevCategory || isFunnelCategory) && (
            <div>
              <Label htmlFor="link">Live Link (optional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          <div>
            <Label htmlFor="project_card_image">Project Card Image *</Label>
            <Input
              id="project_card_image"
              type="file"
              accept="image/*"
              onChange={handleProjectCardImageChange}
              required
            />
            {projectCardImage && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {projectCardImage.name}
              </p>
            )}
          </div>

          {/* Funnel Design specific image uploads - Now optional */}
          {isFunnelCategory ? (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Funnel Images (Desktop, Tablet, Mobile) - Optional</Label>
                <p className="text-sm text-slate-600 mb-3">Upload images for each device view (all optional)</p>
                
                {/* Desktop Image */}
                <div className="space-y-2">
                  <Label htmlFor="desktop_image">Desktop View (optional)</Label>
                  <Input
                    id="desktop_image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFunnelImageChange('desktop', e.target.files?.[0] || null)}
                  />
                  {funnelImages.desktop && (
                    <p className="text-sm text-green-600">Selected: {funnelImages.desktop.name}</p>
                  )}
                </div>

                {/* Tablet Image */}
                <div className="space-y-2">
                  <Label htmlFor="tablet_image">Tablet View (optional)</Label>
                  <Input
                    id="tablet_image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFunnelImageChange('tablet', e.target.files?.[0] || null)}
                  />
                  {funnelImages.tablet && (
                    <p className="text-sm text-green-600">Selected: {funnelImages.tablet.name}</p>
                  )}
                </div>

                {/* Mobile Image */}
                <div className="space-y-2">
                  <Label htmlFor="mobile_image">Mobile View (optional)</Label>
                  <Input
                    id="mobile_image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFunnelImageChange('mobile', e.target.files?.[0] || null)}
                  />
                  {funnelImages.mobile && (
                    <p className="text-sm text-green-600">Selected: {funnelImages.mobile.name}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Regular carousel media for other categories - now supports videos */
            <div>
              <Label htmlFor="carousel_media">Carousel Images & Videos</Label>
              <Input
                id="carousel_media"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleCarouselMediaChange}
              />
              <p className="text-sm text-slate-600 mt-1">
                You can upload both images and videos. Videos will be displayed with controls in the carousel.
              </p>
              {carouselMedia.length > 0 && (
                <div className="mt-2 space-y-1">
                  {carouselMedia.map((media, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded">
                      <span className="text-sm flex items-center gap-2">
                        {media.type === 'video' ? (
                          <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs">VIDEO</span>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs">IMAGE</span>
                        )}
                        {media.file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCarouselMedia(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="problem">Problem (optional)</Label>
            <textarea
              id="problem"
              value={formData.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
              className="w-full min-h-[100px] p-2 border border-input rounded-md bg-background"
              placeholder="Describe the problem this project addressed..."
            />
          </div>

          <div>
            <Label htmlFor="solution">Solution (optional)</Label>
            <textarea
              id="solution"
              value={formData.solution}
              onChange={(e) => handleInputChange('solution', e.target.value)}
              className="w-full min-h-[100px] p-2 border border-input rounded-md bg-background"
              placeholder="Describe the solution you provided..."
            />
          </div>

          <div>
            <Label htmlFor="detailed_process">Detailed Process</Label>
            <textarea
              id="detailed_process"
              value={formData.detailed_process}
              onChange={(e) => handleInputChange('detailed_process', e.target.value)}
              className="w-full min-h-[100px] p-2 border border-input rounded-md bg-background"
              placeholder="Describe your process in detail..."
            />
          </div>

          <div>
            <Label htmlFor="detailed_results">Detailed Results</Label>
            <textarea
              id="detailed_results"
              value={formData.detailed_results}
              onChange={(e) => handleInputChange('detailed_results', e.target.value)}
              className="w-full min-h-[100px] p-2 border border-input rounded-md bg-background"
              placeholder="Describe the detailed results and impact..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Project...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectForm;
