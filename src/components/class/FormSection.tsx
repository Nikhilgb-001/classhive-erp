import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
  return (
    <div>
      <Label className="text-base font-semibold">{title}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => onInputChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};