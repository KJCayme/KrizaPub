
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

  // Test if the main icon URL loads with better error detection
  useEffect(() => {
    if (!tool.icon || iconTested) return;

    const testImage = new Image();
    
    // Set a timeout to catch cases where the image never loads
    const timeout = setTimeout(() => {
      console.log(`⏰ Icon loading timeout for ${tool.name}: ${tool.icon}`);
      setIconError(true);
      setIconTested(true);
    }, 5000);
    
    testImage.onload = () => {
      clearTimeout(timeout);
      console.log(`✅ Icon loaded successfully for ${tool.name}: ${tool.icon}`);
      setIconError(false);
      setIconTested(true);
    };
    
    testImage.onerror = (e) => {
      clearTimeout(timeout);
      console.log(`❌ Icon failed to load for ${tool.name}: ${tool.icon}`, e);
      setIconError(true);
      setIconTested(true);
    };
    
    // Handle network errors by checking if the image src is set properly
    try {
      testImage.src = tool.icon;
    } catch (error) {
      clearTimeout(timeout);
      console.log(`❌ Icon URL error for ${tool.name}: ${tool.icon}`, error);
      setIconError(true);
      setIconTested(true);
    }

    return () => {
      clearTimeout(timeout);
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
    console.log('Main icon failed to load (img onError) for:', tool.name);
    setIconError(true);
    setIconTested(true);
  };

  // Determine what to display based on icon availability and errors
  const hasUploadedIcon = tool.uploaded_icon && tool.uploaded_icon.trim() !== '';
  const hasValidMainIcon = tool.icon && tool.icon.trim() !== '';
  
  // Show fallback if: main icon failed to load OR main icon hasn't been tested yet but we have fallback
  const shouldUseFallback = (iconError && hasUploadedIcon && !fallbackError) || 
                           (!iconTested && hasUploadedIcon && hasValidMainIcon);
  
  // Show main icon only if it passed the test and no error occurred
  const shouldShowMainIcon = !iconError && hasValidMainIcon && iconTested;
  
  // Show placeholder if no valid options are available
  const shouldShowPlaceholder = !shouldShowMainIcon && !shouldUseFallback;
  
  const isOwner = user && user.id === tool.user_id;
  const shouldShowUploadControls = showUpload && isOwner;

  console.log('Tool icon render state:', {
    toolName: tool.name,
    iconError,
    fallbackError,
    hasUploadedIcon,
    hasValidMainIcon,
    shouldUseFallback,
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
      ) : shouldUseFallback ? (
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
