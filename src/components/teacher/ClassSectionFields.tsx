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
  // Function to process array values
  const processArrayValues = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return [];
    return arr.flatMap(item => item.split(',').map(subItem => subItem.trim()));
  };

  const classes = processArrayValues(classConfig?.classes);
  const sections = processArrayValues(classConfig?.sections);

  console.log('Available classes:', classes);
  console.log('Available sections:', sections);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="class">Class</Label>
        <Select value={selectedClass} onValueChange={onClassChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {classes.map((className: string, index: number) => (
              <SelectItem 
                key={index} 
                value={className} 
                className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full"
              >
                {className}
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
            {sections.map((section: string, index: number) => (
              <SelectItem 
                key={index} 
                value={section} 
                className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full"
              >
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};