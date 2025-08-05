import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Upload, X, Star, Eye, Quote } from 'lucide-react';
import { StarRating } from './ui/star-rating';
import { useAddTestimonial } from '../hooks/useTestimonials';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddTestimonialFormProps {
  onClose: () => void;
}

const AddTestimonialForm: React.FC<AddTestimonialFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    feedback: '',
  });
  const [censoringData, setCensoringData] = useState({
    name_censored: false,
    company_censored: false,
    email_censored: false,
  });
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [feedbackImage, setFeedbackImage] = useState<File | null>(null);
  const [feedbackImagePreview, setFeedbackImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addTestimonialMutation = useAddTestimonial();
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeedbackImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeedbackImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }

    try {
      setIsUploading(true);
      
      let imageUrl = '';
      let feedbackImageUrl = '';
      
      if (image) {
        imageUrl = await uploadImage(image);
      }
      
      if (feedbackImage) {
        feedbackImageUrl = await uploadImage(feedbackImage);
      }

      await addTestimonialMutation.mutateAsync({
        name: formData.name.trim() || undefined,
        name_censored: censoringData.name_censored,
        company: formData.company.trim() || undefined,
        company_censored: censoringData.company_censored,
        email: formData.email.trim() || undefined,
        email_censored: censoringData.email_censored,
        rate: rating,
        feedback: formData.feedback.trim(),
        image: imageUrl || undefined,
        feedback_picture: feedbackImageUrl || undefined,
      });

      onClose();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCensoringChange = (field: string, checked: boolean) => {
    setCensoringData(prev => ({ ...prev, [field]: checked }));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const PreviewCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Preview</h3>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 relative">
        <div className="absolute top-6 right-6 text-blue-200 dark:text-blue-800">
          <Quote className="w-6 h-6" />
        </div>

        {/* User Section */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={formData.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {(formData.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-800 dark:text-white text-base truncate">
              {censoringData.name_censored && formData.name ? 
                formData.name.substring(0, 2) + '*'.repeat(formData.name.length - 2) : 
                formData.name || '**********************'
              }
            </h4>
            {formData.company && (
              <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
                {censoringData.company_censored ? 
                  formData.company.substring(0, 2) + '*'.repeat(formData.company.length - 2) : 
                  formData.company
                }
              </p>
            )}
            {formData.email && (
              <p className="text-slate-500 dark:text-slate-500 text-sm truncate">
                {censoringData.email_censored ? 
                  formData.email.substring(0, 2) + '*'.repeat(formData.email.length - 2) : 
                  formData.email
                }
              </p>
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex mb-6">
          {renderStars(rating)}
        </div>

        {/* Feedback Section */}
        {formData.feedback && (
          <div className={feedbackImagePreview ? 'mb-6' : ''}>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic text-base">
              "{formData.feedback || 'Your testimonial will appear here...'}"
            </p>
          </div>
        )}

        {/* Evidence Section */}
        {feedbackImagePreview && (
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            <div className="w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900 h-64">
              <img
                src={feedbackImagePreview}
                alt="Feedback Evidence"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Don't render the form if user is not authenticated  
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                Authentication Required
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-center py-4 text-slate-600 dark:text-slate-300">
              You need to be signed in to add testimonials.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Form Section */}
        <div className="w-[500px] p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
              Add Testimonial
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name (Optional)</Label>
              <div className="space-y-2">
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name (defaults to '**********************')"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="name-censored"
                    checked={censoringData.name_censored}
                    onCheckedChange={(checked) => handleCensoringChange('name_censored', checked as boolean)}
                  />
                  <label htmlFor="name-censored" className="text-sm text-slate-600 dark:text-slate-400">
                    Censored
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <div className="space-y-2">
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company (defaults to '************************')"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="company-censored"
                    checked={censoringData.company_censored}
                    onCheckedChange={(checked) => handleCensoringChange('company_censored', checked as boolean)}
                  />
                  <label htmlFor="company-censored" className="text-sm text-slate-600 dark:text-slate-400">
                    Censored
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-censored"
                    checked={censoringData.email_censored}
                    onCheckedChange={(checked) => handleCensoringChange('email_censored', checked as boolean)}
                  />
                  <label htmlFor="email-censored" className="text-sm text-slate-600 dark:text-slate-400">
                    Censored
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label>Rating</Label>
              <div className="mt-1">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                  allowHalf={true}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Click on the left half of a star for half ratings
              </p>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback *</Label>
              <Textarea
                id="feedback"
                placeholder="Share your experience..."
                value={formData.feedback}
                onChange={(e) => handleInputChange('feedback', e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="image">Profile Picture (Optional) - 150x150px recommended</Label>
              <div className="mt-1">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Profile Picture
                </Button>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="feedback-image">Feedback Picture (Optional) - 400x300px recommended</Label>
              <div className="mt-1">
                <input
                  id="feedback-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFeedbackImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('feedback-image')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Feedback Picture
                </Button>
                {feedbackImagePreview && (
                  <div className="mt-2">
                    <img
                      src={feedbackImagePreview}
                      alt="Feedback Preview"
                      className="w-24 h-24 rounded object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
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
                disabled={isUploading || addTestimonialMutation.isPending}
                className="flex-1"
              >
                {isUploading || addTestimonialMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className={`flex-1 p-6 overflow-y-auto ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <PreviewCard />
        </div>
      </div>
    </div>
  );
};

export default AddTestimonialForm;
