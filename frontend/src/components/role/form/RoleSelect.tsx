
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleSelectProps {
  value: AppRole;
  onChange: (value: AppRole) => void;
}

const roles: AppRole[] = ['school_admin', 'teacher', 'student'];

export const RoleSelect = ({ value, onChange }: RoleSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role} className="capitalize">
              {role.replace('_', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
