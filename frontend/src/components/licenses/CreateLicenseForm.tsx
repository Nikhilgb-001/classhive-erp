import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const CreateLicenseForm = () => {
  const [schoolId, setSchoolId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('licenses')
        .insert([
          {
            school_id: schoolId,
            expiry_date: expiryDate,
            status: 'active'
          }
        ]);

      if (error) throw error;

      toast({
        title: "License Created",
        description: "The license has been created successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      setSchoolId("");
      setExpiryDate("");
    } catch (error) {
      console.error('Error creating license:', error);
      toast({
        title: "Error",
        description: "Failed to create license. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#1A1F2C] p-6 rounded-lg">
      <div className="space-y-2">
        <label htmlFor="schoolId" className="text-white">School ID</label>
        <Input
          id="schoolId"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          required
          className="bg-white text-primary border-gray-200"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="expiryDate" className="text-white">Expiry Date</label>
        <Input
          id="expiryDate"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
          className="bg-white text-primary border-gray-200"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-white text-primary hover:bg-gray-100" 
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create License"}
      </Button>
    </form>
  );
};