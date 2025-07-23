
import React, { useState } from 'react';
import { X, Star, Upload, Eye, Quote } from 'lucide-react';
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
              {formData.name_censored && formData.name ? 
                formData.name.substring(0, 2) + '*'.repeat(formData.name.length - 2) : 
                formData.name || '**********************'
              }
            </h4>
            {formData.company && (
              <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
                {formData.company_censored ? 
                  formData.company.substring(0, 2) + '*'.repeat(formData.company.length - 2) : 
                  formData.company
                }
              </p>
            )}
            {formData.email && (
              <p className="text-slate-500 dark:text-slate-500 text-sm truncate">
                {formData.email_censored ? 
                  formData.email.substring(0, 2) + '*'.repeat(formData.email.length - 2) : 
                  formData.email
                }
              </p>
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex mb-6">
          {renderStars(formData.rate)}
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Form Section - Made smaller */}
        <div className="w-96 p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
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
              <Label htmlFor="code" className="text-sm">Testimonial Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter your testimonial code"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="feedback" className="text-sm">Testimonial *</Label>
              <Textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Share your experience working with Kenneth..."
                rows={3}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm">Rating *</Label>
              <div className="flex items-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="text-lg focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
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
              <Label htmlFor="name" className="text-sm">Your Name (optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1"
              />
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id="name_censored"
                  checked={formData.name_censored}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, name_censored: checked as boolean }))
                  }
                />
                <Label htmlFor="name_censored" className="text-xs text-slate-600 dark:text-slate-400">
                  Keep my name private
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="mt-1"
              />
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id="email_censored"
                  checked={formData.email_censored}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, email_censored: checked as boolean }))
                  }
                />
                <Label htmlFor="email_censored" className="text-xs text-slate-600 dark:text-slate-400">
                  Keep my email private
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="company" className="text-sm">Company (optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter your company name"
                className="mt-1"
              />
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id="company_censored"
                  checked={formData.company_censored}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, company_censored: checked as boolean }))
                  }
                />
                <Label htmlFor="company_censored" className="text-xs text-slate-600 dark:text-slate-400">
                  Keep my company private
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="image" className="text-sm">Profile Image (optional)</Label>
              <div className="mt-1">
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
                  className="w-full text-sm"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Profile Image
                </Button>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="feedback_picture" className="text-sm">Feedback Screenshot (optional)</Label>
              <div className="mt-1">
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
                  className="w-full text-sm"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Feedback Screenshot
                </Button>
                {feedbackImagePreview && (
                  <div className="mt-2">
                    <img
                      src={feedbackImagePreview}
                      alt="Feedback preview"
                      className="max-w-full h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateClientTestimonial.isPending}
                className="flex-1"
                size="sm"
              >
                {updateClientTestimonial.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section - Made bigger */}
        <div className={`flex-1 p-6 overflow-y-auto ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <PreviewCard />
        </div>
      </div>
    </div>
  );
};

export default AddClientTestimonialForm;
