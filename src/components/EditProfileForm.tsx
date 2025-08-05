
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Edit, Upload, Trash2, FileText } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface EditProfileFormProps {
  onProfileUpdated?: () => void;
}

const EditProfileForm = ({ onProfileUpdated }: EditProfileFormProps) => {
  const { user } = useAuth();
  const { profile, updateProfile, uploadResume, deleteResume } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    roles: '',
    caption: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        roles: profile.roles || '',
        caption: profile.caption || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await updateProfile(formData);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
      setIsOpen(false);
      // Trigger refetch in parent components
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    }

    setIsLoading(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setResumeUploading(true);
    const { error } = await uploadResume(file);

    if (error) {
      toast.error('Failed to upload resume');
    } else {
      toast.success('Resume uploaded successfully');
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    }

    setResumeUploading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResumeDelete = async () => {
    if (!profile?.resume_url) return;

    const { error } = await deleteResume();

    if (error) {
      toast.error('Failed to delete resume');
    } else {
      toast.success('Resume deleted successfully');
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roles">Roles (comma-separated)</Label>
            <Input
              id="roles"
              value={formData.roles}
              onChange={(e) => setFormData(prev => ({ ...prev, roles: e.target.value }))}
              placeholder="e.g. Virtual Assistant, Designer, Developer"
            />
            <p className="text-xs text-slate-500">
              Enter roles separated by commas. These will be displayed in the animated hero section.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Enter your caption"
              rows={3}
            />
          </div>

          {/* Resume Upload Section */}
          <div className="space-y-2 border-t pt-4">
            <Label>Resume/CV</Label>
            {profile?.resume_url ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {profile.resume_filename || 'Resume.pdf'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResumeDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={resumeUploading}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {resumeUploading ? 'Updating...' : 'Update Resume'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={resumeUploading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {resumeUploading ? 'Uploading...' : 'Upload Resume'}
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <p className="text-xs text-slate-500">
              Upload a PDF file (max 10MB). This will be available for download on your profile.
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;
