
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserDetailsFields } from "./form/UserDetailsFields";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  schoolId: string;
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
    role: initialData?.role || 'student',
    schoolId: initialData?.school_id || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: AppRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSchoolChange = (schoolId: string) => {
    setFormData(prev => ({ ...prev, schoolId }));
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
          .update({
            name: formData.name,
            phone: formData.phone,
            school_id: formData.schoolId,
          })
          .eq('id', initialData.user_id);

        if (userDetailsError) throw userDetailsError;

        // Update user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({
            role: formData.role,
            school_id: formData.schoolId,
          })
          .eq('user_id', initialData.user_id);

        if (roleError) throw roleError;

        toast({
          title: "User Updated Successfully",
          description: `Updated details for ${formData.name}`,
        });
      } else {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) throw new Error('No authenticated user found');

        // Insert user details
        const { error: detailsError } = await supabase
          .from('user_details')
          .insert({
            name: formData.name,
            phone: formData.phone,
            user_id: session.user.id,
            school_id: formData.schoolId,
          });

        if (detailsError) throw detailsError;

        // Insert user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: session.user.id,
            role: formData.role,
            school_id: formData.schoolId,
          });

        if (roleError) throw roleError;

        toast({
          title: "User Added Successfully",
          description: `Added new user: ${formData.name}`,
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'student',
          schoolId: '',
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
          role={formData.role}
          schoolId={formData.schoolId}
          isEditMode={!!initialData}
          onChange={handleInputChange}
          onRoleChange={handleRoleChange}
          onSchoolChange={handleSchoolChange}
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
