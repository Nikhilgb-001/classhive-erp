import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RoleAccessFormData {
  role: string;
  feature: string;
  accessLevel: string;
}

const roles = ['school_admin', 'teacher', 'student'];
const features = [
  'schools',
  'licenses',
  'users',
  'teachers',
  'students',
  'classes',
  'attendance',
  'assignments',
  'grades',
];
const accessLevels = ['no_access', 'read', 'write', 'full_access'];

export const RoleAccessForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RoleAccessFormData>({
    role: '',
    feature: '',
    accessLevel: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting role permission:', formData);
      
      const { error } = await supabase
        .from('role_permissions')
        .insert([{
          role: formData.role,
          feature: formData.feature,
          access_level: formData.accessLevel,
        }]);

      if (error) {
        console.error('Error inserting role permission:', error);
        throw error;
      }

      toast({
        title: "Role Permission Added Successfully",
        description: `Added ${formData.accessLevel} access for ${formData.role} on ${formData.feature}`,
      });

      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });

    } catch (error) {
      console.error('Error adding role permission:', error);
      toast({
        title: "Error",
        description: "Failed to add role permission. Please try again.",
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
          <Label htmlFor="feature">Feature</Label>
          <Select
            value={formData.feature}
            onValueChange={(value) => setFormData(prev => ({ ...prev, feature: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a feature" />
            </SelectTrigger>
            <SelectContent>
              {features.map((feature) => (
                <SelectItem key={feature} value={feature} className="capitalize">
                  {feature.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessLevel">Access Level</Label>
          <Select
            value={formData.accessLevel}
            onValueChange={(value) => setFormData(prev => ({ ...prev, accessLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              {accessLevels.map((level) => (
                <SelectItem key={level} value={level} className="capitalize">
                  {level.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]" 
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Role Permission"}
      </Button>
    </form>
  );
};