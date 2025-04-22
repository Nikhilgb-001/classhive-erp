import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectSelectProps {
  subjects: string[];
  value: string;
  onValueChange: (value: string) => void;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  subjects,
  value,
  onValueChange,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-white text-foreground">
        <SelectValue placeholder="Select primary subject" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {subjects.map((subject) => (
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
  );
};