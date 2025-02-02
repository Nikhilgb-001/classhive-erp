import * as React from "react";
import { CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface SubjectListProps {
  subjects: string[];
  selectedSubjects: string[];
  onSubjectToggle: (subject: string) => void;
}

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  selectedSubjects,
  onSubjectToggle,
}) => {
  return (
    <>
      {subjects.map((subject) => (
        <CommandItem
          key={subject}
          onSelect={() => onSubjectToggle(subject)}
          className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
        >
          <Checkbox
            checked={selectedSubjects.includes(subject)}
            onCheckedChange={() => onSubjectToggle(subject)}
          />
          <span className="text-sm text-foreground">{subject}</span>
        </CommandItem>
      ))}
    </>
  );
};