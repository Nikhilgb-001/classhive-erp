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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">License Management</h1>
          <p className="text-gray-500 mt-2">Manage school licenses and subscriptions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New License</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">School</label>
                <Select
                  value={selectedSchool}
                  onValueChange={setSelectedSchool}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools?.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.school_name} - {school.school_app_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <Button 
                type="submit" 
                disabled={createLicense.isPending || !selectedSchool || !expiryDate}
              >
                {createLicense.isPending ? "Creating..." : "Create License"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLicenses ? (
              <p>Loading licenses...</p>
            ) : licenses?.length ? (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <div
                    key={license.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {license.schools?.school_name} ({license.schools?.school_app_id})
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires: {format(new Date(license.expiry_date), 'PP')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        license.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {license.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No licenses found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminLicenses;