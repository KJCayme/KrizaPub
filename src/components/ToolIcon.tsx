
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useUpdateTool } from '../hooks/useTools';

interface ToolIconProps {
  tool: {
    id: string;
    name: string;
    icon: string;
    uploaded_icon?: string;
    user_id?: string;
  };
  className?: string;
  showUpload?: boolean;
}

const ToolIcon = ({ tool, className = "w-6 h-6", showUpload = false }: ToolIconProps) => {
  const { user } = useAuth();
  const updateToolMutation = useUpdateTool();
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        await updateToolMutation.mutateAsync({
          id: tool.id,
          updates: {
            uploaded_icon: base64
          }
        });
        
        setImageError(false);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading icon:', error);
      setIsUploading(false);
    }
  };

  const handleRemoveUploadedIcon = async () => {
    if (!user) return;
    
    try {
      await updateToolMutation.mutateAsync({
        id: tool.id,
        updates: {
          uploaded_icon: null
        }
      });
      setImageError(false);
    } catch (error) {
      console.error('Error removing uploaded icon:', error);
    }
  };

  // Use uploaded icon if available, otherwise use URL icon
  const iconSrc = tool.uploaded_icon || tool.icon;
  const shouldShowFallback = imageError && !tool.uploaded_icon;

  return (
    <div className="relative">
      {shouldShowFallback ? (
        <div className={`${className} bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center`}>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {tool.name.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <img
          src={iconSrc}
          alt={tool.name}
          className={`${className} object-contain`}
          onError={handleImageError}
        />
      )}
      
      {showUpload && user && user.id === tool.user_id && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          {tool.uploaded_icon && (
            <Button
              onClick={handleRemoveUploadedIcon}
              variant="ghost"
              size="icon"
              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full"
              disabled={updateToolMutation.isPending}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          
          <label className="cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full pointer-events-none"
              disabled={isUploading}
            >
              <Upload className="w-3 h-3" />
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ToolIcon;
