import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SchoolFormData } from "@/types/school";

interface SchoolFormFieldsProps {
  formData: SchoolFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SchoolFormFields = ({ formData, onChange }: SchoolFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="schoolName" className="text-[#1A1F2C]">School Name</Label>
        <Input
          id="schoolName"
          name="schoolName"
          value={formData.schoolName}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schoolCode" className="text-[#1A1F2C]">School Code</Label>
        <Input
          id="schoolCode"
          name="schoolCode"
          value={formData.schoolCode}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schoolAddress" className="text-[#1A1F2C]">School Address</Label>
        <Input
          id="schoolAddress"
          name="schoolAddress"
          value={formData.schoolAddress}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminName" className="text-[#1A1F2C]">Admin Name</Label>
        <Input
          id="adminName"
          name="adminName"
          value={formData.adminName}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminEmail" className="text-[#1A1F2C]">Admin Email</Label>
        <Input
          id="adminEmail"
          name="adminEmail"
          type="email"
          value={formData.adminEmail}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminPhone" className="text-[#1A1F2C]">Admin Phone</Label>
        <Input
          id="adminPhone"
          name="adminPhone"
          type="tel"
          value={formData.adminPhone}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="billingContactName" className="text-[#1A1F2C]">Billing Contact Name</Label>
        <Input
          id="billingContactName"
          name="billingContactName"
          value={formData.billingContactName}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="billingPhone" className="text-[#1A1F2C]">Billing Phone</Label>
        <Input
          id="billingPhone"
          name="billingPhone"
          type="tel"
          value={formData.billingPhone}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="billingEmail" className="text-[#1A1F2C]">Billing Email</Label>
        <Input
          id="billingEmail"
          name="billingEmail"
          type="email"
          value={formData.billingEmail}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="founderName" className="text-[#1A1F2C]">Founder Name</Label>
        <Input
          id="founderName"
          name="founderName"
          value={formData.founderName}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="founderPhone" className="text-[#1A1F2C]">Founder Phone</Label>
        <Input
          id="founderPhone"
          name="founderPhone"
          type="tel"
          value={formData.founderPhone}
          onChange={onChange}
          required
          className="bg-white text-[#1A1F2C] border-[#1A1F2C]/10"
        />
      </div>
    </div>
  );
};