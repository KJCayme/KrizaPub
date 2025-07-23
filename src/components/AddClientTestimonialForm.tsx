import React, { useState } from 'react';
import { X, Star, Upload, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useUpdateClientTestimonial } from '../hooks/useClientTestimonials';
import { toast } from 'sonner';

interface AddClientTestimonialFormProps {
  onClose: () => void;
}

const AddClientTestimonialForm = ({ onClose }: AddClientTestimonialFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    company: '',
    feedback: '',
    rate: 5,
    image: null as File | null,
    feedback_picture: null as File | null,
    name_censored: false,
    email_censored: false,
    company_censored: false,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [feedbackImagePreview, setFeedbackImagePreview] = useState<string>('');

  const updateClientTestimonial = useUpdateClientTestimonial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error('Please enter a valid code');
      return;
    }

    if (!formData.feedback.trim()) {
      toast.error('Please enter your testimonial');
      return;
    }

    try {
      await updateClientTestimonial.mutateAsync({
        code: formData.code,
        name: formData.name || undefined,
        email: formData.email || undefined,
        company: formData.company || undefined,
        feedback: formData.feedback,
        rate: formData.rate,
        image: formData.image || undefined,
        feedback_picture: formData.feedback_picture || undefined,
        name_censored: formData.name_censored,
        email_censored: formData.email_censored,
        company_censored: formData.company_censored,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rate: rating }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'feedback_picture') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'image') {
          setImagePreview(e.target?.result as string);
        } else {
          setFeedbackImagePreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({ ...prev, [type]: file }));
    }
  };

  const PreviewCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Preview</h3>
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          {(imagePreview || formData.image) && (
            <div className="flex-shrink-0">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= formData.rate
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 mb-4 italic">
              "{formData.feedback || 'Your testimonial will appear here...'}"
            </p>
            
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p className="font-medium">
                {formData.name_censored && formData.name ? 
                  formData.name.substring(0, 2) + '*'.repeat(formData.name.length - 2) : 
                  formData.name || 'Anonymous'
                }
              </p>
              {formData.company && (
                <p>
                  {formData.company_censored ? 
                    formData.company.substring(0, 2) + '*'.repeat(formData.company.length - 2) : 
                    formData.company
                  }
                </p>
              )}
            </div>
          </div>
        </div>
        
        {(feedbackImagePreview || formData.feedback_picture) && (
          <div className="mt-4">
            <img
              src={feedbackImagePreview}
              alt="Feedback preview"
              className="max-w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Form Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Add Client Testimonial
            </h2>
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
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Testimonial Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter your testimonial code"
                required
              />
            </div>

            <div>
              <Label htmlFor="feedback">Testimonial *</Label>
              <Textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Share your experience working with Kenneth..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Rating *</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rate
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Your Name (optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="name_censored"
                  checked={formData.name_censored}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, name_censored: checked as boolean }))
                  }
                />
                <Label htmlFor="name_censored" className="text-sm text-slate-600 dark:text-slate-400">
                  Keep my name private
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="email_censored"
                  checked={formData.email_censored}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, email_censored: checked as boolean }))
                  }
                />
                <Label htmlFor="email_censored" className="text-sm text-slate-600 dark:text-slate-400">
                  Keep my email private
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company (optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter your company name"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="company_censored"
                  checked={formData.company_censored}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, company_censored: checked as boolean }))
                  }
                />
                <Label htmlFor="company_censored" className="text-sm text-slate-600 dark:text-slate-400">
                  Keep my company private
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Profile Image (optional)</Label>
              <div className="mt-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Profile Image
                </Button>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="feedback_picture">Feedback Screenshot (optional)</Label>
              <div className="mt-2">
                <Input
                  id="feedback_picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'feedback_picture')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('feedback_picture')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Feedback Screenshot
                </Button>
                {feedbackImagePreview && (
                  <div className="mt-2">
                    <img
                      src={feedbackImagePreview}
                      alt="Feedback preview"
                      className="max-w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
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
                disabled={updateClientTestimonial.isPending}
                className="flex-1"
              >
                {updateClientTestimonial.isPending ? 'Submitting...' : 'Submit Testimonial'}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section - Hidden on mobile, shown on desktop */}
        <div className={`w-80 border-l border-slate-200 dark:border-slate-700 p-6 overflow-y-auto ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <PreviewCard />
        </div>
      </div>
    </div>
  );
};

export default AddClientTestimonialForm;
