import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWhyChooseMe, useUpdateWhyChooseMe, WhyChooseMeData } from '@/hooks/useWhyChooseMe';
import { Trash2, Plus } from 'lucide-react';

interface EditWhyChooseMeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_DATA: WhyChooseMeData[] = [
  {
    caption: "Dedicated and reliable virtual assistant with proven track record",
    sort_order: 0
  },
  {
    caption: "Excellent communication skills and attention to detail",
    sort_order: 1
  },
  {
    caption: "Flexible and adaptable to your business needs",
    sort_order: 2
  },
  {
    caption: "Cost-effective solution for your administrative tasks",
    sort_order: 3
  }
];

export const EditWhyChooseMeForm = ({ isOpen, onClose }: EditWhyChooseMeFormProps) => {
  const { data: dbData, isLoading } = useWhyChooseMe();
  const updateWhyChooseMe = useUpdateWhyChooseMe();
  const [items, setItems] = useState<WhyChooseMeData[]>(FALLBACK_DATA);

  useEffect(() => {
    if (dbData && dbData.length > 0) {
      setItems(dbData);
    } else {
      setItems(FALLBACK_DATA);
    }
  }, [dbData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWhyChooseMe.mutateAsync(items);
    onClose();
  };

  const addItem = () => {
    setItems([...items, {
      caption: '',
      sort_order: items.length
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], caption: value };
    setItems(updatedItems);
  };

  if (isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Why Choose Me</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor={`caption-${index}`}>Reason {index + 1}</Label>
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
              
              <Textarea
                id={`caption-${index}`}
                value={item.caption}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder="Enter why clients should choose you..."
                required
                rows={2}
              />
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addItem} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Reason
          </Button>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateWhyChooseMe.isPending}>
              {updateWhyChooseMe.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};