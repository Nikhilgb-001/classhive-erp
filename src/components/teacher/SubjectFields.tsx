import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SubjectFieldsProps {
  classConfig: {
    subjects: string[];
  } | null;
  selectedSubjects: string;
  primarySubject: string;
  onSubjectsChange: (value: string) => void;
  onPrimarySubjectChange: (value: string) => void;
}

export const SubjectFields = ({
  classConfig,
  selectedSubjects,
  primarySubject,
  onSubjectsChange,
  onPrimarySubjectChange,
}: SubjectFieldsProps) => {
  const processArrayValues = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return [];
    const combinedString = arr.join(',');
    return combinedString.split(',').map(item => item.trim()).filter(Boolean);
  };

  const subjects = processArrayValues(classConfig?.subjects);
  const selectedSubjectsArray = selectedSubjects ? selectedSubjects.split(',') : [];
  
  console.log('Available subjects:', subjects);
  console.log('Selected subjects:', selectedSubjectsArray);

  const handleSubjectsChange = (value: string[]) => {
    onSubjectsChange(value.join(','));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="subjects">Subjects Handled</Label>
        <div className="border rounded-md p-4 bg-white">
          <ToggleGroup 
            type="multiple" 
            className="flex flex-wrap gap-2"
            value={selectedSubjectsArray}
            onValueChange={handleSubjectsChange}
          >
            {subjects.map((subject: string, index: number) => (
              <ToggleGroupItem 
                key={index} 
                value={subject}
                className="bg-white border-2 border-gray-200 text-foreground hover:bg-gray-100"
              >
                {subject}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="primarySubject">Primary Subject</Label>
        <Select value={primarySubject} onValueChange={onPrimarySubjectChange}>
          <SelectTrigger className="bg-white text-foreground">
            <SelectValue placeholder="Select primary subject" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {subjects.map((subject: string, index: number) => (
              <SelectItem 
                key={index} 
                value={subject} 
                className="cursor-pointer hover:bg-gray-100 text-foreground"
              >
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};