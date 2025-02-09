
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Database } from "@/integrations/supabase/types";

interface UserDetailsFieldsProps {
  name: string;
  email: string;
  phone: string;
  isEditMode: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserDetailsFields = ({ 
  name, 
  email, 
  phone, 
  isEditMode, 
  onChange 
}: UserDetailsFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>

      {!isEditMode && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={onChange}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={onChange}
          required
        />
      </div>
    </>
  );
};
