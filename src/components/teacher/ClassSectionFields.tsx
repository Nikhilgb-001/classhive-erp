import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassSectionFieldsProps {
  classConfig: {
    classes: string[];
    sections: string[];
  } | null;
  selectedClass: string;
  selectedSection: string;
  onClassChange: (value: string) => void;
  onSectionChange: (value: string) => void;
}

export const ClassSectionFields = ({
  classConfig,
  selectedClass,
  selectedSection,
  onClassChange,
  onSectionChange,
}: ClassSectionFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="class">Class</Label>
        <Select value={selectedClass} onValueChange={onClassChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {classConfig?.classes[0].split(',').map((className: string, index: number) => (
              <SelectItem 
                key={index} 
                value={className.trim()} 
                className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full"
              >
                {className.trim()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="section">Section</Label>
        <Select value={selectedSection} onValueChange={onSectionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {classConfig?.sections[0].split(',').map((section: string, index: number) => (
              <SelectItem 
                key={index} 
                value={section.trim()} 
                className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full"
              >
                {section.trim()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};