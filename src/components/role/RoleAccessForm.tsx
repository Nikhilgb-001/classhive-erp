import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RoleAccessFormData {
  role: string;
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

const roles = ['super_admin', 'school_admin', 'teacher', 'student'];

export const RoleAccessForm = ({ initialData, onSuccess }: RoleAccessFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RoleAccessFormData>({
    role: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    schoolId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        role: initialData.role,
        name: initialData.user_details?.name || '',
        email: initialData.email || '',
        password: '',
        phone: initialData.user_details?.phone || '',
        schoolId: initialData.schoolDetails?.id || '',
      });
    }
  }, [initialData]);

  // Fetch schools for dropdown
  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, school_name, school_code')
        .order('school_name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Starting form submission...');

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
        console.log('Creating new user...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (!authData.user?.id) {
          throw new Error('No user ID returned from auth signup');
        }

        console.log('User created, inserting role...', authData.user.id);
        
        // Insert user role first
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: formData.role as any,
          }]);

        if (roleError) throw roleError;

        console.log('Role inserted, creating user details...');
        
        // Then insert user details
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
          role: '',
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
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {!initialData && (formData.role === 'super_admin' || formData.role === 'school_admin') && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {(formData.role === 'school_admin' || formData.role === 'teacher' || formData.role === 'student') && (
          <div className="space-y-2">
            <Label htmlFor="schoolId">School</Label>
            <Select
              value={formData.schoolId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, schoolId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools?.map((school) => (
                  <SelectItem 
                    key={school.id} 
                    value={school.id}
                  >
                    {`${school.school_name} (${school.school_code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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