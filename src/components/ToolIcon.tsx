
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
    console.log('Image error for tool:', tool.name, 'URL:', tool.icon);
    setImageError(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log('Uploading file for tool:', tool.name);
    setIsUploading(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        console.log('File converted to base64, updating tool...');
        
        await updateToolMutation.mutateAsync({
          id: tool.id,
          updates: {
            uploaded_icon: base64
          }
        });
        
        console.log('Tool updated successfully');
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
    
    console.log('Removing uploaded icon for tool:', tool.name);
    try {
      await updateToolMutation.mutateAsync({
        id: tool.id,
        updates: {
          uploaded_icon: null
        }
      });
      console.log('Uploaded icon removed successfully');
      setImageError(false);
    } catch (error) {
      console.error('Error removing uploaded icon:', error);
    }
  };

  // Determine what to display
  const hasUploadedIcon = tool.uploaded_icon && tool.uploaded_icon.trim() !== '';
  const shouldShowFallback = imageError && !hasUploadedIcon;
  const shouldShowUploadedIcon = hasUploadedIcon;
  const shouldShowOriginalIcon = !imageError && !hasUploadedIcon;
  const isOwner = user && user.id === tool.user_id;
  const shouldShowUploadControls = showUpload && isOwner && (imageError || hasUploadedIcon);

  console.log('Tool render state:', {
    toolName: tool.name,
    imageError,
    hasUploadedIcon,
    shouldShowFallback,
    shouldShowUploadedIcon,
    shouldShowOriginalIcon,
    shouldShowUploadControls
  });

  return (
    <div className="relative">
      {shouldShowFallback ? (
        <div className={`${className} bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center`}>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {tool.name.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : shouldShowUploadedIcon ? (
        <img
          src={tool.uploaded_icon}
          alt={tool.name}
          className={`${className} object-contain`}
          onError={() => {
            console.log('Uploaded icon failed to load for:', tool.name);
            setImageError(true);
          }}
        />
      ) : (
        <img
          src={tool.icon}
          alt={tool.name}
          className={`${className} object-contain`}
          onError={handleImageError}
        />
      )}
      
      {shouldShowUploadControls && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          {hasUploadedIcon && (
            <Button
              onClick={handleRemoveUploadedIcon}
              variant="ghost"
              size="icon"
              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full"
              disabled={updateToolMutation.isPending}
              title="Remove uploaded icon"
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
              title={hasUploadedIcon ? "Replace uploaded icon" : "Upload fallback icon"}
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
