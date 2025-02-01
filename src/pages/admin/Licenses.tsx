import React, { useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateLicenseForm } from "@/components/licenses/CreateLicenseForm";
import { LicenseList } from "@/components/licenses/LicenseList";

const AdminLicenses = () => {
  const queryClient = useQueryClient();
  
  const { data: licenses } = useQuery({
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

  useEffect(() => {
    checkExpiredLicenses();
  }, [licenses]);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-primary">License Management</h1>
        </div>

        <Card className="bg-primary">
          <CardHeader className="border-b border-primary-600">
            <CardTitle className="text-xl text-white">Create New License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <CreateLicenseForm />
          </CardContent>
        </Card>

        <Card className="bg-primary">
          <CardHeader className="border-b border-primary-600">
            <CardTitle className="text-xl text-white">Active Licenses</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <LicenseList />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminLicenses;