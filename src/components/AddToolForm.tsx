import React, { useState } from 'react';
import { X, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../hooks/useAuth';
import { useTools, useAddTool, useUpdateTool, useDeleteTool, type Tool } from '../hooks/useTools';
import ToolIcon from './ToolIcon';

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
    color: 'bg-blue-100'
  });

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

    try {
      await addToolMutation.mutateAsync({
        ...formData,
        user_id: user.id
      });
      
      setFormData({
        name: '',
        icon: '',
        color: 'bg-blue-100'
      });
      onClose();
    } catch (error) {
      console.error('Error adding tool:', error);
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

  const getIconStatus = (tool: Tool) => {
    if (tool.uploaded_icon) {
      return {
        status: 'Has fallback icon',
        icon: CheckCircle,
        color: 'text-green-400'
      };
    }
    return {
      status: 'URL icon only',
      icon: AlertCircle,
      color: 'text-yellow-400'
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
                    <br />
                    Note: If the URL fails to load, you can upload a fallback icon after creating the tool.
                  </p>
                </div>

                <div className="md:col-span-2">
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
              </div>

              <Button 
                type="submit" 
                disabled={addToolMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {addToolMutation.isPending ? 'Adding...' : 'Add Tool'}
              </Button>
            </form>
          </div>

          {/* Existing Tools List */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Existing Tools
              <span className="text-sm font-normal text-slate-400 ml-2">
                (Hover over tools to upload fallback icons if URL fails)
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
                          showUpload={true}
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
