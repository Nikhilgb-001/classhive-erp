import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface FormSectionProps {
  title: string;
  items: string[];
  placeholder: string;
  onInputChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export const FormSection = ({
  title,
  items,
  placeholder,
  onInputChange,
  onRemove,
}: FormSectionProps) => {
  const addNewItem = () => {
    onInputChange(items.length, "");
  };

  return (
    <div>
      <Label className="text-base font-semibold text-gray-900">{title}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => onInputChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-white text-gray-900"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
              className="text-gray-700 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewItem}
          className="mt-2 text-gray-700 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title}
        </Button>
      </div>
    </div>
  );
};