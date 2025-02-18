
import { AppLayout } from "@/components/layouts/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { OnboardingHeader } from "@/components/admin/onboarding/OnboardingHeader";
import { SchoolTable } from "@/components/admin/onboarding/SchoolTable";

const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(null);

  const { data: schools, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('Fetching schools...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Check if user is super_admin
      const { data: isAdmin } = await supabase.rpc('is_super_admin', {
        user_id: user.id
      });

      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('schools')
        .select('*, settings')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }

      // Transform data to include schema_name if not present
      const transformedData = data.map(school => ({
        ...school,
        schema_name: school.schema_name || `school_${school.school_code.toLowerCase().replace(/-/g, '_')}`,
      }));

      console.log('Fetched schools:', transformedData);
      return transformedData;
    },
  });

  const handleExportCSV = () => {
    if (!schools || schools.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "School Name",
      "School Code",
      "Schema Name",
      "School Address",
      "Admin Name",
      "Admin Email",
      "Admin Phone",
      "Billing Contact Name",
      "Billing Email",
      "Billing Phone",
      "Founder Name",
      "Founder Phone",
      "Status",
      "Created At"
    ].join(",");

    const csvData = schools.map(school => [
      school.school_name,
      school.school_code,
      school.schema_name,
      school.school_address,
      school.admin_name,
      school.admin_email,
      school.admin_phone,
      school.billing_contact_name,
      school.billing_email,
      school.billing_phone,
      school.founder_name,
      school.founder_phone,
      school.status,
      format(new Date(school.created_at), 'MM/dd/yyyy')
    ].map(field => `"${field || ''}"`).join(","));

    const csvContent = [headers, ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `school_onboarding_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast.success("CSV file downloaded successfully");
  };

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-[1400px] mx-auto space-y-6 bg-[#F1F1F1] min-h-screen p-6">
          <OnboardingHeader 
            onBack={() => navigate('/admin')}
            onExport={handleExportCSV}
            onNew={() => navigate('/admin/onboarding/new')}
          />
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Error Loading Schools</h3>
              <p className="text-gray-500 mt-2">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 bg-[#F1F1F1] min-h-screen p-6">
        <OnboardingHeader 
          onBack={() => navigate('/admin')}
          onExport={handleExportCSV}
          onNew={() => navigate('/admin/onboarding/new')}
        />
        <SchoolTable
          schools={schools}
          isLoading={isLoading}
          onSchoolSelect={setSelectedSchool}
        />
      </div>
    </AppLayout>
  );
};

export default AdminOnboarding;
