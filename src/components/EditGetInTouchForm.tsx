import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetInTouch, useUpdateGetInTouch, GetInTouchData } from '@/hooks/useGetInTouch';
import { Trash2, Plus, ExternalLink } from 'lucide-react';

interface EditGetInTouchFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_DATA: GetInTouchData[] = [
  {
    icon: "Mail",
    social: "example@gmail.com",
    caption: "Email",
    sort_order: 0
  },
  {
    icon: "Phone",
    social: "+1234567890",
    caption: "Phone",
    sort_order: 1
  },
  {
    icon: "Linkedin",
    social: "linkedin.com/in/yourprofile",
    caption: "LinkedIn",
    sort_order: 2
  },
  {
    icon: "Github",
    social: "github.com/yourusername",
    caption: "GitHub",
    sort_order: 3
  },
  {
    icon: "MapPin",
    social: "Your Location",
    caption: "Location",
    sort_order: 4
  }
];

export const EditGetInTouchForm = ({ isOpen, onClose }: EditGetInTouchFormProps) => {
  const { data: dbData, isLoading } = useGetInTouch();
  const updateGetInTouch = useUpdateGetInTouch();
  const [items, setItems] = useState<GetInTouchData[]>(FALLBACK_DATA);

  useEffect(() => {
    if (dbData && dbData.length > 0) {
      setItems(dbData);
    } else {
      setItems(FALLBACK_DATA);
    }
  }, [dbData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length > 5) {
      alert('Maximum 5 entries allowed');
      return;
    }
    
    await updateGetInTouch.mutateAsync(items);
    onClose();
  };

  const addItem = () => {
    if (items.length >= 5) {
      alert('Maximum 5 entries allowed');
      return;
    }
    
    setItems([...items, {
      icon: '',
      social: '',
      caption: '',
      sort_order: items.length
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof GetInTouchData, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  if (isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Get In Touch Information</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Find icons at: 
            <a 
              href="https://lucide.dev/icons/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-primary hover:underline inline-flex items-center gap-1"
            >
              Lucide Icons <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Use the exact icon name (e.g., "Mail", "Phone", "Linkedin")
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Item {index + 1}</span>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`icon-${index}`}>Icon</Label>
                  <Input
                    id={`icon-${index}`}
                    value={item.icon}
                    onChange={(e) => updateItem(index, 'icon', e.target.value)}
                    placeholder="e.g., Mail"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`social-${index}`}>Contact Info</Label>
                  <Input
                    id={`social-${index}`}
                    value={item.social}
                    onChange={(e) => updateItem(index, 'social', e.target.value)}
                    placeholder="e.g., example@gmail.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`caption-${index}`}>Caption</Label>
                  <Input
                    id={`caption-${index}`}
                    value={item.caption}
                    onChange={(e) => updateItem(index, 'caption', e.target.value)}
                    placeholder="e.g., Email"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          
          {items.length < 5 && (
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Item (Max 5)
            </Button>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateGetInTouch.isPending}>
              {updateGetInTouch.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};