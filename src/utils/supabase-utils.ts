import { supabase } from "@/integrations/supabase/client";

export const uploadSchoolLogo = async (schoolAppId: string, logoFile: File): Promise<string | null> => {
  if (!logoFile) return null;

  const fileExt = logoFile.name.split('.').pop();
  const filePath = `${schoolAppId}.${fileExt}`;

  try {
    const { error: uploadError } = await supabase.storage
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

export const generateSchoolAppId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SCH-${timestamp}-${randomNum}`;
};