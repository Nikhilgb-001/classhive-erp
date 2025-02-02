import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // Function to process array values
  const processArrayValues = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return [];
    return arr.flatMap(item => item.split(',').map(subItem => subItem.trim()));
  };

  const subjects = processArrayValues(classConfig?.subjects);
  
  console.log('Available subjects:', subjects);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="subjects">Subjects Handled</Label>
        <Select value={selectedSubjects} onValueChange={onSubjectsChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select subjects" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {subjects.map((subject: string, index: number) => (
              <SelectItem 
                key={index} 
                value={subject} 
                className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full"
              >
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="primarySubject">Primary Subject</Label>
        <Select value={primarySubject} onValueChange={onPrimarySubjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select primary subject" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {subjects.map((subject: string, index: number) => (
              <SelectItem 
                key={index} 
                value={subject} 
                className="cursor-pointer hover:bg-gray-100 py-2 px-4 block w-full"
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