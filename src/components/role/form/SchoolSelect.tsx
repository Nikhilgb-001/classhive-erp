
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type AppRole = Database["public"]["Enums"]["app_role"];

interface SchoolSelectProps {
  role: AppRole;
  value: string;
  onChange: (value: string) => void;
}

export const SchoolSelect = ({ role, value, onChange }: SchoolSelectProps) => {
  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, school_name, school_code')
        .order('school_name');
      
      if (error) throw error;
      return data;
    },
  });

  if (!['school_admin', 'teacher', 'student'].includes(role)) {
    return null;
  }

  if (isLoading) {
    return <div>Loading schools...</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="schoolId">School</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a school" />
        </SelectTrigger>
        <SelectContent>
          {schools?.map((school) => (
            <SelectItem 
              key={school.id} 
              value={school.id}
            >
              {`${school.school_name} (${school.school_code})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
