import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const SchoolOnboardingForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCode: "",
    schoolAddress: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    billingContactName: "",
    billingPhone: "",
    billingEmail: "",
    founderName: "",
    founderPhone: "",
  });

  const generateSchoolAppId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SCH-${timestamp}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schoolAppId = generateSchoolAppId();
    
    try {
      const { error } = await supabase
        .from('schools')
        .insert([
          {
            school_app_id: schoolAppId,
            school_name: formData.schoolName,
            school_code: formData.schoolCode,
            school_address: formData.schoolAddress,
            admin_name: formData.adminName,
            admin_email: formData.adminEmail,
            admin_phone: formData.adminPhone,
            billing_contact_name: formData.billingContactName,
            billing_phone: formData.billingPhone,
            billing_email: formData.billingEmail,
            founder_name: formData.founderName,
            founder_phone: formData.founderPhone,
          }
        ]);

      if (error) throw error;

      toast({
        title: "School Onboarded Successfully",
        description: `School App ID: ${schoolAppId}`,
      });

      // Reset form
      setFormData({
        schoolName: "",
        schoolCode: "",
        schoolAddress: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        billingContactName: "",
        billingPhone: "",
        billingEmail: "",
        founderName: "",
        founderPhone: "",
      });

      // Refresh schools list
      queryClient.invalidateQueries({ queryKey: ['schools'] });

    } catch (error) {
      console.error('Error onboarding school:', error);
      toast({
        title: "Error",
        description: "Failed to onboard school. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name</Label>
          <Input
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolCode">School Code</Label>
          <Input
            id="schoolCode"
            name="schoolCode"
            value={formData.schoolCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolAddress">School Address</Label>
          <Input
            id="schoolAddress"
            name="schoolAddress"
            value={formData.schoolAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminName">Admin Name</Label>
          <Input
            id="adminName"
            name="adminName"
            value={formData.adminName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminEmail">Admin Email</Label>
          <Input
            id="adminEmail"
            name="adminEmail"
            type="email"
            value={formData.adminEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminPhone">Admin Phone</Label>
          <Input
            id="adminPhone"
            name="adminPhone"
            type="tel"
            value={formData.adminPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingContactName">Billing Contact Name</Label>
          <Input
            id="billingContactName"
            name="billingContactName"
            value={formData.billingContactName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingPhone">Billing Phone</Label>
          <Input
            id="billingPhone"
            name="billingPhone"
            type="tel"
            value={formData.billingPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingEmail">Billing Email</Label>
          <Input
            id="billingEmail"
            name="billingEmail"
            type="email"
            value={formData.billingEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="founderName">Founder Name</Label>
          <Input
            id="founderName"
            name="founderName"
            value={formData.founderName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="founderPhone">Founder Phone</Label>
          <Input
            id="founderPhone"
            name="founderPhone"
            type="tel"
            value={formData.founderPhone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Onboard School</Button>
    </form>
  );
};