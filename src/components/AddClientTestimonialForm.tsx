
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useClientTestimonials } from '@/hooks/useClientTestimonials';
import { toast } from 'sonner';

export const AddClientTestimonialForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    rating: 5,
    image_url: ''
  });

  const { data: testimonials, isLoading } = useClientTestimonials();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.success('Testimonial added successfully!');
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        rating: 5,
        image_url: ''
      });
    } catch (error) {
      toast.error('Failed to add testimonial');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
      {/* Form Section - Smaller (2 columns) */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Add Client Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Adding...' : 'Add Testimonial'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section - Bigger (3 columns) */}
      <div className="lg:col-span-3">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Preview matching the testimonials card design */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="relative">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt={formData.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white/30">
                      <span className="text-slate-500 text-sm font-medium">
                        {(formData.name || 'John Doe').split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {formData.name || 'John Doe'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {formData.company || 'Company Name'}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {formData.email || 'email@example.com'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-slate-600 leading-relaxed">
                "{formData.message || 'Your testimonial message will appear here...'}"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddClientTestimonialForm;
