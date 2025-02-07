import { useState } from "react";
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

const roles = ['super_admin', 'school_admin', 'teacher', 'student'];

export const RoleAccessForm = () => {
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

    try {
      console.log('Submitting user data:', formData);
      
      // First create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            school_id: formData.schoolId,
          }
        }
      });

      if (authError) throw authError;

      // Then add the role
      if (authData.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: formData.role as any, // Using type from database
          }]);

        if (roleError) throw roleError;
      }

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

    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
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

        {(formData.role === 'super_admin' || formData.role === 'school_admin') && (
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
        {isLoading ? "Adding..." : "Add User"}
      </Button>
    </form>
  );
};