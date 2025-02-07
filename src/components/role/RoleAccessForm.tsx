import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { RoleSelect } from "./form/RoleSelect";
import { UserDetailsFields } from "./form/UserDetailsFields";
import { SchoolSelect } from "./form/SchoolSelect";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleAccessFormData {
  role: AppRole;
  name: string;
  email: string;
  password: string;
  phone: string;
  schoolId?: string;
}

interface RoleAccessFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export const RoleAccessForm = ({ initialData, onSuccess }: RoleAccessFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RoleAccessFormData>({
    role: 'student',
    name: '',
    email: '',
    password: '',
    phone: '',
    schoolId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        role: initialData.role as AppRole,
        name: initialData.user_details?.name || '',
        email: initialData.email || '',
        password: '',
        phone: initialData.user_details?.phone || '',
        schoolId: initialData.schoolDetails?.id || '',
      });
    }
  }, [initialData]);

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
        // Update existing role
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({
            role: formData.role,
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;

        // Update user details
        const { error: userDetailsError } = await supabase
          .from('user_details')
          .upsert({
            user_id: initialData.user_id,
            name: formData.name,
            phone: formData.phone,
            school_id: formData.schoolId || null,
          });

        if (userDetailsError) throw userDetailsError;

        toast({
          title: "Role Updated Successfully",
          description: `Updated role for ${formData.name}`,
        });
      } else {
        // Create new user and role
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (!authData.user?.id) {
          throw new Error('No user ID returned from auth signup');
        }

        // Insert user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: formData.role,
          }]);

        if (roleError) throw roleError;

        // Insert user details
        const { error: detailsError } = await supabase
          .from('user_details')
          .insert([{
            user_id: authData.user.id,
            name: formData.name,
            phone: formData.phone,
            school_id: formData.schoolId || null,
          }]);

        if (detailsError) throw detailsError;

        toast({
          title: "User Added Successfully",
          description: `Added new ${formData.role} user: ${formData.name}`,
        });

        // Reset form
        setFormData({
          role: 'student',
          name: '',
          email: '',
          password: '',
          phone: '',
          schoolId: '',
        });
      }

      onSuccess?.();

    } catch (error) {
      console.error('Error managing user:', error);
      toast({
        title: "Error",
        description: "Failed to manage user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        <RoleSelect 
          value={formData.role} 
          onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
        />

        <UserDetailsFields
          role={formData.role}
          name={formData.name}
          email={formData.email}
          password={formData.password}
          phone={formData.phone}
          isEditMode={!!initialData}
          onChange={handleInputChange}
        />

        <SchoolSelect
          role={formData.role}
          value={formData.schoolId || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, schoolId: value }))}
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