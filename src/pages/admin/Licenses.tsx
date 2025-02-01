import React, { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const AdminLicenses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  // Fetch schools
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

  // Fetch licenses
  const { data: licenses, isLoading: isLoadingLicenses } = useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      console.log('Fetching licenses...');
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          schools (
            school_name,
            school_app_id
          )
        `);
      
      if (error) {
        console.error('Error fetching licenses:', error);
        throw error;
      }
      console.log('Fetched licenses:', data);
      return data;
    }
  });

  // Create license mutation
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

  // Check and update expired licenses
  const checkExpiredLicenses = async () => {
    if (!licenses) return;

    const now = new Date();
    const expiredLicenses = licenses.filter(license => 
      new Date(license.expiry_date) < now && license.status === 'active'
    );

    for (const license of expiredLicenses) {
      const { error } = await supabase
        .from('licenses')
        .update({ status: 'inactive' })
        .eq('id', license.id);

      if (error) {
        console.error('Error updating license status:', error);
      }
    }

    if (expiredLicenses.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    }
  };

  // Check for expired licenses when licenses data changes
  React.useEffect(() => {
    checkExpiredLicenses();
  }, [licenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLicense.mutate();
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-primary">License Management</h1>
        </div>

        <Card className="bg-white shadow-md">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl text-primary">Create New License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">School</label>
                  <Select
                    value={selectedSchool}
                    onValueChange={setSelectedSchool}
                  >
                    <SelectTrigger className="bg-white border border-gray-200 text-primary">
                      <SelectValue placeholder="Select a school" className="text-primary" />
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
                  <label className="text-sm font-medium text-primary">Expiry Date</label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white border border-gray-200 text-primary"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={createLicense.isPending || !selectedSchool || !expiryDate}
                className="bg-primary text-white hover:bg-primary-600"
              >
                {createLicense.isPending ? "Creating..." : "Create License"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl text-primary">Active Licenses</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingLicenses ? (
              <p className="text-gray-500">Loading licenses...</p>
            ) : licenses?.length ? (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <div
                    key={license.id}
                    className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <p className="font-medium text-primary">
                          {license.schools?.school_name} ({license.schools?.school_app_id})
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires: {format(new Date(license.expiry_date), 'PP')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm inline-flex items-center justify-center ${
                          license.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {license.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No licenses found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminLicenses;