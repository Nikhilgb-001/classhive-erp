import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInfoFields = ({ onChange }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            placeholder="Enter first name"
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            placeholder="Enter last name"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter email address"
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="Enter phone number"
          onChange={onChange}
        />
      </div>
    </>
  );
};