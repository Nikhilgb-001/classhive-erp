import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserDetailsFieldsProps {
  role: AppRole;
  name: string;
  email: string;
  password: string;
  phone: string;
  isEditMode: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserDetailsFields = ({ 
  role, 
  name, 
  email, 
  password, 
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

      {!isEditMode && (role === 'super_admin' || role === 'school_admin') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              required
              minLength={6}
            />
          </div>
        </>
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