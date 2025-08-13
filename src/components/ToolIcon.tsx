
import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useUpdateTool } from '../hooks/useTools';
import { supabase } from '@/integrations/supabase/client';

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
  const [iconError, setIconError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [iconTested, setIconTested] = useState(false);

  // Test if the main icon URL loads
  useEffect(() => {
    if (!tool.icon || iconTested) return;

    const testImage = new Image();
    testImage.onload = () => {
      console.log(`✅ Icon loaded successfully for ${tool.name}: ${tool.icon}`);
      setIconError(false);
      setIconTested(true);
    };
    testImage.onerror = () => {
      console.log(`❌ Icon failed to load for ${tool.name}: ${tool.icon}`);
      setIconError(true);
      setIconTested(true);
    };
    testImage.src = tool.icon;

    return () => {
      testImage.onload = null;
      testImage.onerror = null;
    };
  }, [tool.icon, tool.name, iconTested]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log('Uploading fallback icon for tool:', tool.name);
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(`tool-icons/${fileName}`, file);

      if (uploadError) {
        console.error('Error uploading fallback icon:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(uploadData.path);
      
      await updateToolMutation.mutateAsync({
        id: tool.id,
        updates: {
          uploaded_icon: publicUrl
        }
      });
      
      console.log('Fallback icon uploaded successfully');
      setFallbackError(false);
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading fallback icon:', error);
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

  const handleFallbackIconError = () => {
    console.log('Fallback icon failed to load for:', tool.name);
    setFallbackError(true);
  };

  const handleMainIconError = () => {
    console.log('Main icon failed to load for:', tool.name);
    setIconError(true);
    setIconTested(true);
  };

  // Determine what to display based on icon availability and errors
  const hasUploadedIcon = tool.uploaded_icon && tool.uploaded_icon.trim() !== '';
  const shouldUseFallback = iconError && hasUploadedIcon && !fallbackError;
  const shouldShowFallback = (!iconTested && hasUploadedIcon) || shouldUseFallback || (!tool.icon && hasUploadedIcon);
  const shouldShowMainIcon = !iconError && tool.icon && iconTested;
  const shouldShowPlaceholder = (!shouldShowMainIcon && !shouldShowFallback) || (hasUploadedIcon && fallbackError) || (!hasUploadedIcon && iconError);
  
  const isOwner = user && user.id === tool.user_id;
  const shouldShowUploadControls = showUpload && isOwner;

  console.log('Tool icon render state:', {
    toolName: tool.name,
    iconError,
    fallbackError,
    hasUploadedIcon,
    shouldUseFallback,
    shouldShowFallback,
    shouldShowMainIcon,
    shouldShowPlaceholder,
    iconTested
  });

  return (
    <div className="relative">
      {shouldShowPlaceholder ? (
        <div className={`${className} bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center`}>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {tool.name.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : shouldShowFallback ? (
        <img
          src={tool.uploaded_icon}
          alt={tool.name}
          className={`${className} object-contain`}
          onError={handleFallbackIconError}
        />
      ) : shouldShowMainIcon ? (
        <img
          src={tool.icon}
          alt={tool.name}
          className={`${className} object-contain`}
          onError={handleMainIconError}
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
              title={hasUploadedIcon ? "Replace fallback icon" : "Upload fallback icon"}
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
