
import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  onImageUploaded?: () => void;
}

const ProfileImageUpload = ({ onImageUploaded }: ProfileImageUploadProps) => {
  const { user } = useAuth();
  const { uploadProfileImage } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const { error } = await uploadProfileImage(file);

    if (error) {
      toast.error('Failed to upload image');
    } else {
      toast.success('Profile image updated successfully');
      // Trigger refetch in parent components
      if (onImageUploaded) {
        onImageUploaded();
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) return null;

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Profile Picture
      </Button>
    </div>
  );
};

export default ProfileImageUpload;
