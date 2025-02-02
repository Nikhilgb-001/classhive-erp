import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SubjectList } from "./subjects/SubjectList";
import { SubjectSelect } from "./subjects/SubjectSelect";
import { processSubjectsArray } from "./subjects/utils";

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
  const subjects = React.useMemo(
    () => processSubjectsArray(classConfig?.subjects),
    [classConfig?.subjects]
  );
  
  const selectedSubjectsArray = React.useMemo(
    () => selectedSubjects ? selectedSubjects.split(',').map(s => s.trim()).filter(Boolean) : [],
    [selectedSubjects]
  );
  
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
                <SubjectList
                  subjects={subjects}
                  selectedSubjects={selectedSubjectsArray}
                  onSubjectToggle={handleSubjectToggle}
                />
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="primarySubject">Primary Subject</Label>
        <SubjectSelect
          subjects={subjects}
          value={primarySubject}
          onValueChange={onPrimarySubjectChange}
        />
      </div>
    </div>
  );
};