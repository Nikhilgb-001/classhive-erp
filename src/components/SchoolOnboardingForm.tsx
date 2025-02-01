import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface SchoolFormData {
  schoolName: string;
  schoolCode: string;
  schoolAddress: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  billingContactName: string;
  billingPhone: string;
  billingEmail: string;
  founderName: string;
  founderPhone: string;
  logoUrl?: string;
}

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
      setFormData({
        schoolName: initialData.schoolName || "",
        schoolCode: initialData.schoolCode || "",
        schoolAddress: initialData.schoolAddress || "",
        adminName: initialData.adminName || "",
        adminEmail: initialData.adminEmail || "",
        adminPhone: initialData.adminPhone || "",
        billingContactName: initialData.billingContactName || "",
        billingPhone: initialData.billingPhone || "",
        billingEmail: initialData.billingEmail || "",
        founderName: initialData.founderName || "",
        founderPhone: initialData.founderPhone || "",
        logoUrl: initialData.logoUrl || "",
      });
      if (initialData.logoUrl) {
        setPreviewUrl(initialData.logoUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    // Check for active session
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

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const uploadLogo = async (schoolAppId: string): Promise<string | null> => {
    if (!logoFile) return null;

    const fileExt = logoFile.name.split('.').pop();
    const filePath = `${schoolAppId}.${fileExt}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('school-logos')
        .upload(filePath, logoFile, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('school-logos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadLogo:', error);
      throw error;
    }
  };

  const generateSchoolAppId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SCH-${timestamp}-${randomNum}`;
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
        logoUrl = await uploadLogo(schoolAppId);
      }
      
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
      };

      const { error } = await supabase
        .from('schools')
        .insert([schoolData]);

      if (error) {
        console.error('Error inserting/updating school:', error);
        throw error;
      }

      toast({
        title: initialData ? "School Updated Successfully" : "School Onboarded Successfully",
        description: `School App ID: ${schoolAppId}`,
      });

      // Refresh schools list
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      
      // Navigate back to the onboarding list
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!session) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || ""} alt="School logo" />
          <AvatarFallback className="bg-primary/10">
            {formData.schoolName ? formData.schoolName[0].toUpperCase() : "S"}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="logo" className="cursor-pointer">
            <div className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
              <Upload className="h-4 w-4" />
              <span>Upload Logo</span>
            </div>
          </Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Recommended: Square image, at least 128x128px
          </p>
        </div>
      </div>

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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (initialData ? "Updating..." : "Onboarding...") : (initialData ? "Update School" : "Onboard School")}
      </Button>
    </form>
  );
};