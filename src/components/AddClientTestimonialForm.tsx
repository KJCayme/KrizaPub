
import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useUpdateClientTestimonial } from '../hooks/useClientTestimonials';

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
    image: '',
    feedback_picture: '',
    name_censored: false,
    email_censored: false,
    company_censored: false,
  });

  const updateClientTestimonial = useUpdateClientTestimonial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      alert('Please enter a valid code');
      return;
    }

    try {
      await updateClientTestimonial.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rate: rating }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Add Client Testimonial
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-6 h-6" />
          </button>
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
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
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
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
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
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Enter your company name"
              required
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
            <Label htmlFor="image">Profile Image URL (optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>

          <div>
            <Label htmlFor="feedback_picture">Feedback Screenshot URL (optional)</Label>
            <Input
              id="feedback_picture"
              value={formData.feedback_picture}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback_picture: e.target.value }))}
              placeholder="https://example.com/feedback-screenshot.jpg"
            />
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
    </div>
  );
};

export default AddClientTestimonialForm;
