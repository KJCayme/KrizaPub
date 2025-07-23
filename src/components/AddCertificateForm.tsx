import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Star, Upload, X } from 'lucide-react';
import { useCertificates } from '../hooks/useCertificates';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddCertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CertificateFormData {
  name: string;
  year: string;
  issued_by: string;
  caption: string;
  link: string;
  skills_covered: string[];
  title_color: 'light' | 'dark';
}

const AddCertificateForm: React.FC<AddCertificateFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    name: '',
    year: '',
    issued_by: '',
    caption: '',
    link: '',
    skills_covered: [] as string[],
    title_color: 'light' as 'light' | 'dark'
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCertificate } = useCertificates();
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

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

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
    
    if (!formData.name.trim() || !formData.year.trim() || !formData.issued_by.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const certificateData = {
        name: formData.name.trim(),
        year: formData.year.trim(),
        issued_by: formData.issued_by.trim(),
        caption: formData.caption.trim() || undefined,
        link: formData.link.trim() || undefined,
        skills_covered: formData.skills_covered,
        certificate_image_card: imageUrl,
        title_color: formData.title_color
      };

      await addCertificate(certificateData);
      
      // Reset form
      setFormData({
        name: '',
        year: '',
        issued_by: '',
        caption: '',
        link: '',
        skills_covered: [],
        title_color: 'light'
      });
      setImage(null);
      setImagePreview(null);
      
      toast.success('Certificate added successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error adding certificate:', error);
      toast.error(error.message || 'Failed to add certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CertificateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        setFormData(prev => ({
          ...prev,
          skills_covered: [...prev.skills_covered, value]
        }));
        e.currentTarget.value = ''; // Clear the input
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills_covered: prev.skills_covered.filter(skill => skill !== skillToRemove)
    }));
  };

  if (!user || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
              Add Certificate
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Certificate Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="text"
                placeholder="Year of Issue"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="issued_by">Issued By *</Label>
              <Input
                id="issued_by"
                type="text"
                placeholder="Issuing Organization"
                value={formData.issued_by}
                onChange={(e) => handleInputChange('issued_by', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Title & Year Text Color</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  variant={formData.title_color === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, title_color: 'light' }))}
                  className="flex-1"
                >
                  Light Text
                </Button>
                <Button
                  type="button"
                  variant={formData.title_color === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, title_color: 'dark' }))}
                  className="flex-1"
                >
                  Dark Text
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Textarea
                id="caption"
                placeholder="Short Description"
                value={formData.caption}
                onChange={(e) => handleInputChange('caption', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="link">Link (Optional)</Label>
              <Input
                id="link"
                type="url"
                placeholder="Certificate Link"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="skills_covered">Skills Covered (Press Enter to add)</Label>
              <Input
                id="skills_covered"
                type="text"
                placeholder="Enter a skill and press Enter"
                onKeyDown={handleSkillsKeyDown}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills_covered.map((skill, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} <X className="w-4 h-4 ml-1" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="image">Certificate Image (Optional)</Label>
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
                  Upload Image
                </Button>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded"
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
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCertificateForm;
