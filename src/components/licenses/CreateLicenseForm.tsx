import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CreateLicenseForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const { data: schools, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('Fetching schools...');
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('school_name');
      
      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      console.log('Fetched schools:', data);
      return data;
    }
  });

  const createLicense = useMutation({
    mutationFn: async () => {
      if (!selectedSchool || !expiryDate) {
        throw new Error('Please select a school and expiry date');
      }

      const { error } = await supabase
        .from('licenses')
        .insert([
          {
            school_id: selectedSchool,
            expiry_date: new Date(expiryDate).toISOString(),
            status: 'active'
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      toast({
        title: "Success",
        description: "License created successfully",
      });
      setSelectedSchool("");
      setExpiryDate("");
    },
    onError: (error) => {
      console.error('Error creating license:', error);
      toast({
        title: "Error",
        description: "Failed to create license",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLicense.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">School</label>
          <Select
            value={selectedSchool}
            onValueChange={setSelectedSchool}
          >
            <SelectTrigger className="bg-white text-primary border-gray-200">
              <SelectValue placeholder="Select a school" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {schools?.map((school) => (
                <SelectItem 
                  key={school.id} 
                  value={school.id}
                  className="text-primary hover:bg-gray-100"
                >
                  {school.school_name} - {school.school_app_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Expiry Date</label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="bg-white text-primary border-gray-200"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={createLicense.isPending || !selectedSchool || !expiryDate}
        className="bg-white text-primary hover:bg-gray-100"
      >
        {createLicense.isPending ? "Creating..." : "Create License"}
      </Button>
    </form>
  );
};