
import React, { useState, useEffect } from 'react';
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
  const [originalIconError, setOriginalIconError] = useState(false);
  const [uploadedIconError, setUploadedIconError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);

  // Test if the original icon URL loads
  useEffect(() => {
    const testImage = new Image();
    testImage.onload = () => {
      console.log(`✅ Icon loaded successfully for ${tool.name}: ${tool.icon}`);
      setOriginalIconError(false);
      setIconLoaded(true);
    };
    testImage.onerror = () => {
      console.log(`❌ Icon failed to load for ${tool.name}: ${tool.icon}`);
      setOriginalIconError(true);
      setIconLoaded(true);
    };
    testImage.src = tool.icon;
  }, [tool.icon, tool.name]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log('Uploading file for tool:', tool.name);
    setIsUploading(true);
    
    try {
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
        setUploadedIconError(false);
        setIsUploading(false);
        // Reset the file input
        event.target.value = '';
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
    } catch (error) {
      console.error('Error removing uploaded icon:', error);
    }
  };

  const handleUploadedIconError = () => {
    console.log('Uploaded icon failed to load for:', tool.name);
    setUploadedIconError(true);
  };

  // Determine what to display
  const hasUploadedIcon = tool.uploaded_icon && tool.uploaded_icon.trim() !== '';
  const shouldShowFallback = (originalIconError || !iconLoaded) && (!hasUploadedIcon || uploadedIconError);
  const shouldShowUploadedIcon = hasUploadedIcon && !uploadedIconError;
  const shouldShowOriginalIcon = !originalIconError && iconLoaded && !hasUploadedIcon;
  const isOwner = user && user.id === tool.user_id;
  const shouldShowUploadControls = showUpload && isOwner && (originalIconError || hasUploadedIcon);

  console.log('Tool render state:', {
    toolName: tool.name,
    originalIconError,
    uploadedIconError,
    hasUploadedIcon,
    shouldShowFallback,
    shouldShowUploadedIcon,
    shouldShowOriginalIcon,
    shouldShowUploadControls,
    iconLoaded
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
          onError={handleUploadedIconError}
        />
      ) : shouldShowOriginalIcon ? (
        <img
          src={tool.icon}
          alt={tool.name}
          className={`${className} object-contain`}
          onError={() => {
            console.log('Original icon failed to load on render for:', tool.name);
            setOriginalIconError(true);
          }}
        />
      ) : (
        <div className={`${className} bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center`}>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {tool.name.charAt(0).toUpperCase()}
          </span>
        </div>
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
              disabled={isUploading || updateToolMutation.isPending}
              title={hasUploadedIcon ? "Replace uploaded icon" : "Upload fallback icon"}
            >
              <Upload className="w-3 h-3" />
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading || updateToolMutation.isPending}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ToolIcon;
