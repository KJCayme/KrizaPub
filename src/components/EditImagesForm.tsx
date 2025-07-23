import React, { useState } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface EditImagesFormProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number | null;
  }>;
  onUpdate: () => void;
}

const EditImagesForm = ({ isOpen, onClose, images, onUpdate }: EditImagesFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExisting = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('about_carousel')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast.success('Image deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `about/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleUpdate = async () => {
    if (!user) return;

    setIsUploading(true);
    try {
      // Upload new images
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const imageUrl = await uploadToSupabase(file);
        
        const { error } = await supabase
          .from('about_carousel')
          .insert({
            image_url: imageUrl,
            alt_text: file.name,
            sort_order: images.length + i,
            user_id: user.id
          });

        if (error) throw error;
      }

      toast.success('Images updated successfully');
      setNewImages([]);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating images:', error);
      toast.error('Failed to update images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Images</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Existing Images */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Current Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'About carousel image'}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteExisting(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">New Images to Upload</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Images */}
          <div className="mb-8">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Plus className="w-8 h-8 mb-2 text-slate-500 dark:text-slate-400" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Click to add images</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUploading || newImages.length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              {isUploading ? 'Updating...' : 'Update Images'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditImagesForm;
