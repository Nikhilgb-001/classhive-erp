import * as React from "react";
import { Label } from "@/components/ui/label";
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
  primarySubject,
  onPrimarySubjectChange,
}) => {
  const subjects = React.useMemo(
    () => processSubjectsArray(classConfig?.subjects),
    [classConfig?.subjects]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="primarySubject">Primary Subject</Label>
      <SubjectSelect
        subjects={subjects}
        value={primarySubject}
        onValueChange={onPrimarySubjectChange}
      />
    </div>
  );
};