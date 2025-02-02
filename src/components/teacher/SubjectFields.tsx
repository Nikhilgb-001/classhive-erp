import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SubjectFieldsProps {
  classConfig: {
    subjects: string[];
  } | null;
  selectedSubjects: string;
  primarySubject: string;
  onSubjectsChange: (value: string) => void;
  onPrimarySubjectChange: (value: string) => void;
}

export const SubjectFields: React.FC<SubjectFieldsProps> = ({
  classConfig,
  selectedSubjects,
  primarySubject,
  onSubjectsChange,
  onPrimarySubjectChange,
}) => {
  const processArrayValues = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return [];
    const combinedString = arr.join(',');
    return combinedString.split(',').map(item => item.trim()).filter(Boolean);
  };

  const subjects = processArrayValues(classConfig?.subjects);
  const selectedSubjectsArray = selectedSubjects ? selectedSubjects.split(',') : [];
  
  console.log('Available subjects:', subjects);
  console.log('Selected subjects:', selectedSubjectsArray);

  const handleSubjectToggle = (subject: string) => {
    const currentSelected = new Set(selectedSubjectsArray);
    if (currentSelected.has(subject)) {
      currentSelected.delete(subject);
    } else {
      currentSelected.add(subject);
    }
    onSubjectsChange(Array.from(currentSelected).join(','));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="subjects">Subjects Handled</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-white text-foreground hover:bg-gray-100"
            >
              {selectedSubjectsArray.length === 0
                ? "Select subjects"
                : `${selectedSubjectsArray.length} selected`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white">
            <Command>
              <CommandInput placeholder="Search subjects..." className="h-9" />
              <CommandEmpty>No subject found.</CommandEmpty>
              <CommandGroup>
                {subjects.map((subject) => (
                  <CommandItem
                    key={subject}
                    onSelect={() => handleSubjectToggle(subject)}
                    className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedSubjectsArray.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <span className="text-sm text-foreground">{subject}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="primarySubject">Primary Subject</Label>
        <Select value={primarySubject} onValueChange={onPrimarySubjectChange}>
          <SelectTrigger className="bg-white text-foreground">
            <SelectValue placeholder="Select primary subject" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {subjects.map((subject: string) => (
              <SelectItem 
                key={subject} 
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