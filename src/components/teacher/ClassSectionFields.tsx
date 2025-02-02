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
    
    // First, join all array elements and then split by commas
    const combinedString = arr.join(',');
    return combinedString.split(',').map(item => item.trim()).filter(Boolean);
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
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {classes.map((className: string, index: number) => (
              <SelectItem 
                key={index} 
                value={className} 
                className="cursor-pointer hover:bg-gray-100 text-gray-900"
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
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {sections.map((section: string, index: number) => (
              <SelectItem 
                key={index} 
                value={section} 
                className="cursor-pointer hover:bg-gray-100 text-gray-900"
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