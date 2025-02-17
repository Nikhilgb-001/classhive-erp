
import { useState, useEffect } from "react";
import { LogoUpload } from "./school/LogoUpload";
import { SchoolFormFields } from "./school/SchoolFormFields";
import { SchoolFormData } from "@/types/school";
import { useSchoolFormSession } from "./school/SchoolFormSessionHandler";
import { SchoolFormSubmitHandler } from "./school/SchoolFormSubmitHandler";

interface SchoolOnboardingFormProps {
  initialData?: SchoolFormData;
}

export const SchoolOnboardingForm = ({ initialData }: SchoolOnboardingFormProps) => {
  const session = useSchoolFormSession();
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

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!session) {
    return null;
  }

  return (
    <form className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <LogoUpload
        logoUrl={previewUrl}
        schoolName={formData.schoolName}
        onLogoChange={handleLogoChange}
      />
      <SchoolFormFields
        formData={formData}
        onChange={handleInputChange}
      />
      <SchoolFormSubmitHandler
        formData={formData}
        logoFile={logoFile}
        session={session}
        isUpdate={!!initialData}
      />
    </form>
  );
};
