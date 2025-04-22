
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SchoolFormData } from "@/types/school";
import { generateSchoolAppId, uploadSchoolLogo } from "@/utils/supabase-utils";
import { Button } from "@/components/ui/button";

interface SchoolFormSubmitHandlerProps {
  formData: SchoolFormData;
  logoFile: File | null;
  session: any;
  isUpdate?: boolean;
}

export const SchoolFormSubmitHandler = ({ 
  formData, 
  logoFile, 
  session,
  isUpdate 
}: SchoolFormSubmitHandlerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting to insert/update school with session:', session);
      
      // Generate school app id and schema name first
      const schoolAppId = generateSchoolAppId();
      const schemaName = `school_${schoolAppId.toLowerCase().replace(/-/g, '_')}`;
      
      // Upload logo if provided
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        logoUrl = await uploadSchoolLogo(schoolAppId, logoFile);
      }
      
      // First, insert the school record
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert([{
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
          logo_url: logoUrl,
          schema_name: schemaName,
          status: 'pending'
        }])
        .select()
        .single();

      if (schoolError) {
        console.error('Error inserting school:', schoolError);
        throw schoolError;
      }

      if (!schoolData) {
        throw new Error('No school data returned after insert');
      }

      // Then create the role assignment in a separate query
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: session.user.id,
          role: 'school_admin',
          school_id: schoolData.id
        }]);

      if (roleError) {
        console.error('Error creating role:', roleError);
        throw roleError;
      }

      // Log the audit event
      await supabase.rpc('log_audit_event', {
        p_event_type: isUpdate ? 'school_updated' : 'school_created',
        p_details: {
          school_app_id: schoolAppId,
          school_name: formData.schoolName
        }
      });

      toast({
        title: isUpdate ? "School Updated Successfully" : "School Created Successfully",
        description: `School App ID: ${schoolAppId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['schools'] });
      navigate('/admin/onboarding');

    } catch (error) {
      console.error('Error onboarding school:', error);
      toast({
        title: "Error",
        description: "Failed to onboard school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="submit" 
      className="w-full bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]" 
      disabled={isLoading}
      onClick={handleSubmit}
    >
      {isLoading ? (isUpdate ? "Updating..." : "Creating...") : (isUpdate ? "Update School" : "Create School")}
    </Button>
  );
};
