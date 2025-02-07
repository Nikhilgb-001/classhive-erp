import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserDetailsFields } from "./form/UserDetailsFields";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
}

interface RoleAccessFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export const RoleAccessForm = ({ initialData, onSuccess }: RoleAccessFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.user_details?.name || '',
    email: initialData?.email || '',
    phone: initialData?.user_details?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Starting form submission...', formData);

    try {
      if (initialData) {
        // Update user details
        const { error: userDetailsError } = await supabase
          .from('user_details')
          .upsert({
            user_id: initialData.user_id,
            name: formData.name,
            phone: formData.phone,
          });

        if (userDetailsError) throw userDetailsError;

        toast({
          title: "User Updated Successfully",
          description: `Updated details for ${formData.name}`,
        });
      } else {
        // Insert user details
        const { error: detailsError } = await supabase
          .from('user_details')
          .insert([{
            name: formData.name,
            phone: formData.phone,
          }]);

        if (detailsError) throw detailsError;

        toast({
          title: "User Added Successfully",
          description: `Added new user: ${formData.name}`,
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
        });
      }

      onSuccess?.();

    } catch (error) {
      console.error('Error managing user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to manage user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        <UserDetailsFields
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          isEditMode={!!initialData}
          onChange={handleInputChange}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]" 
        disabled={isLoading}
      >
        {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update User" : "Add User")}
      </Button>
    </form>
  );
};