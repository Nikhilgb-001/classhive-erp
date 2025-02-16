
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogoUpload } from "./school/LogoUpload";
import { SchoolFormFields } from "./school/SchoolFormFields";
import { SchoolFormData } from "@/types/school";
import { generateSchoolAppId, uploadSchoolLogo } from "@/utils/supabase-utils";

interface SchoolOnboardingFormProps {
  initialData?: SchoolFormData;
}

export const SchoolOnboardingForm = ({ initialData }: SchoolOnboardingFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<SchoolFormData>({
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
    logoUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.logoUrl) {
        setPreviewUrl(initialData.logoUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        navigate('/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    const schoolAppId = generateSchoolAppId();
    
    try {
      console.log('Attempting to insert/update school with session:', session);
      
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadSchoolLogo(schoolAppId, logoFile);
      }

      // Generate schema name from school app id
      const schemaName = `school_${schoolAppId.toLowerCase().replace(/-/g, '_')}`;
      
      const schoolData = {
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
        settings: {
          theme: {
            primary_color: "#1A1F2C",
            secondary_color: "#2A2F3C",
            text_color: "#000000"
          }
        }
      };

      const { data: schoolResponse, error } = await supabase
        .from('schools')
        .insert([schoolData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting/updating school:', error);
        throw error;
      }

      // Create school admin user role
      if (schoolResponse) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: session.user.id,
            role: 'school_admin',
            school_id: schoolResponse.id
          }]);

        if (roleError) throw roleError;
      }

      toast({
        title: initialData ? "School Updated Successfully" : "School Onboarded Successfully",
        description: `School App ID: ${schoolAppId}`,
      });

      // Log the audit event
      await supabase.rpc('log_audit_event', {
        p_event_type: initialData ? 'school_updated' : 'school_created',
        p_details: {
          school_app_id: schoolAppId,
          school_name: formData.schoolName
        }
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

  if (!session) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <LogoUpload
        logoUrl={previewUrl}
        schoolName={formData.schoolName}
        onLogoChange={handleLogoChange}
      />
      <SchoolFormFields
        formData={formData}
        onChange={handleInputChange}
      />
      <Button 
        type="submit" 
        className="w-full bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]" 
        disabled={isLoading}
      >
        {isLoading ? (initialData ? "Updating..." : "Onboarding...") : (initialData ? "Update School" : "Onboard School")}
      </Button>
    </form>
  );
};
