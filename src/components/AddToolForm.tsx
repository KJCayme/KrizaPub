
import React, { useState } from 'react';
import { X, Trash2, AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../hooks/useAuth';
import { useTools, useAddTool, useUpdateTool, useDeleteTool, type Tool } from '../hooks/useTools';
import ToolIcon from './ToolIcon';
import { supabase } from '@/integrations/supabase/client';

interface AddToolFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToolForm = ({ isOpen, onClose }: AddToolFormProps) => {
  const { user } = useAuth();
  const { data: tools = [] } = useTools();
  const addToolMutation = useAddTool();
  const updateToolMutation = useUpdateTool();
  const deleteToolMutation = useDeleteTool();

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: 'bg-blue-100',
    fallbackIcon: null as File | null
  });

  const [isUploading, setIsUploading] = useState(false);

  const colors = [
    'bg-white',
    'bg-blue-100',
    'bg-purple-100',
    'bg-orange-100',
    'bg-red-100',
    'bg-yellow-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-gray-100'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUploading(true);
    try {
      let uploadedIconUrl = null;

      // Upload fallback icon if provided
      if (formData.fallbackIcon) {
        const fileExt = formData.fallbackIcon.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(`tool-icons/${fileName}`, formData.fallbackIcon);

        if (uploadError) {
          console.error('Error uploading fallback icon:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(uploadData.path);
        
        uploadedIconUrl = publicUrl;
      }

      await addToolMutation.mutateAsync({
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        uploaded_icon: uploadedIconUrl,
        user_id: user.id
      });
      
      setFormData({
        name: '',
        icon: '',
        color: 'bg-blue-100',
        fallbackIcon: null
      });
      onClose();
    } catch (error) {
      console.error('Error adding tool:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!user) return;
    
    try {
      await deleteToolMutation.mutateAsync(toolId);
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        fallbackIcon: file
      }));
    }
  };

  // Test icon loading status
  const [iconStatuses, setIconStatuses] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  const testIconLoad = (tool: Tool) => {
    if (iconStatuses[tool.id]) return iconStatuses[tool.id];
    
    setIconStatuses(prev => ({ ...prev, [tool.id]: 'loading' }));
    
    const img = new Image();
    img.onload = () => {
      setIconStatuses(prev => ({ ...prev, [tool.id]: 'success' }));
    };
    img.onerror = () => {
      setIconStatuses(prev => ({ ...prev, [tool.id]: 'error' }));
    };
    img.src = tool.icon;
    
    return 'loading';
  };

  const getIconStatus = (tool: Tool) => {
    const status = testIconLoad(tool);
    
    if (tool.uploaded_icon) {
      if (status === 'error') {
        return {
          status: 'URL failed, using fallback',
          icon: CheckCircle,
          color: 'text-green-400'
        };
      } else {
        return {
          status: 'Has fallback icon',
          icon: CheckCircle,
          color: 'text-green-400'
        };
      }
    }
    
    if (status === 'loading') {
      return {
        status: 'Testing icon...',
        icon: Clock,
        color: 'text-blue-400'
      };
    }
    
    if (status === 'error') {
      return {
        status: 'Icon URL failed - upload needed',
        icon: AlertCircle,
        color: 'text-red-400'
      };
    }
    
    return {
      status: 'URL icon working',
      icon: CheckCircle,
      color: 'text-green-400'
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Manage Tools
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Tool Form */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Tool</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Tool Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Notion"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="icon" className="text-slate-300">Icon URL</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Tip: You can use favicons from websites (e.g., https://notion.so/favicon.ico)
                  </p>
                </div>

                <div>
                  <Label htmlFor="color" className="text-slate-300">Background Color</Label>
                  <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {colors.map((color) => (
                        <SelectItem key={color} value={color} className="text-white">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color} border border-slate-400`} />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fallbackIcon" className="text-slate-300">Fallback Icon (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fallbackIcon"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    />
                    {formData.fallbackIcon && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, fallbackIcon: null }))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload a backup icon that will be used if the main icon URL fails to load
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={addToolMutation.isPending || isUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isUploading ? 'Uploading...' : addToolMutation.isPending ? 'Adding...' : 'Add Tool'}
              </Button>
            </form>
          </div>

          {/* Existing Tools List */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Existing Tools
              <span className="text-sm font-normal text-slate-400 ml-2">
                (Icons are automatically tested and fallbacks are used when needed)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => {
                const iconStatus = getIconStatus(tool);
                const StatusIcon = iconStatus.icon;
                
                return (
                  <div
                    key={tool.id}
                    className="bg-slate-700 p-4 rounded-lg border border-slate-600 flex items-center justify-between group hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center relative`}>
                        <ToolIcon 
                          tool={tool}
                          className="w-6 h-6"
                          showUpload={false}
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{tool.name}</h4>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-3 h-3 ${iconStatus.color}`} />
                          <p className="text-xs text-slate-400">
                            {iconStatus.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    {user && user.id === tool.user_id && (
                      <Button
                        onClick={() => handleDelete(tool.id)}
                        variant="ghost"
                        size="icon"
                        disabled={deleteToolMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolForm;
