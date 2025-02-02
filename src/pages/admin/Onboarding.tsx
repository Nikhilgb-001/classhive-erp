import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Download, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(null);

  const { data: schools, isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('Fetching schools...');
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      console.log('Fetched schools:', data);
      return data;
    },
    // Add retry and stale time configurations
    retry: 3,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const handleExportCSV = () => {
    if (!schools || schools.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "School Name",
      "School Code",
      "School App ID",
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
      school.school_app_id,
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
    console.error('Error in schools query:', error);
    return (
      <AppLayout>
        <div className="max-w-[1400px] mx-auto space-y-6 bg-[#F1F1F1] min-h-screen p-6">
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
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent text-[#1A1F2C]"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#1A1F2C]">School Onboarding</h1>
        </div>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={() => navigate('/admin/onboarding/new')}
            className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Onboarding
          </Button>
        </div>

        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1A1F2C]/10">
                <TableHead className="text-[#1A1F2C]">SCHOOL NAME</TableHead>
                <TableHead className="text-[#1A1F2C]">ADMIN NAME</TableHead>
                <TableHead className="text-[#1A1F2C]">STATUS</TableHead>
                <TableHead className="text-[#1A1F2C]">CREATED AT</TableHead>
                <TableHead className="text-[#1A1F2C]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show loading skeleton rows
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : schools && schools.length > 0 ? (
                schools.map((school) => (
                  <TableRow key={school.id} className="border-[#1A1F2C]/10">
                    <TableCell className="text-[#1A1F2C] font-medium">
                      {school.school_name}
                    </TableCell>
                    <TableCell className="text-[#1A1F2C]">{school.admin_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        school.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {school.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#1A1F2C]">
                      {format(new Date(school.created_at), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              const formData = {
                                schoolName: school.school_name,
                                schoolCode: school.school_code,
                                schoolAddress: school.school_address,
                                adminName: school.admin_name,
                                adminEmail: school.admin_email,
                                adminPhone: school.admin_phone,
                                billingContactName: school.billing_contact_name,
                                billingPhone: school.billing_phone,
                                billingEmail: school.billing_email,
                                founderName: school.founder_name,
                                founderPhone: school.founder_phone,
                                logoUrl: school.logo_url,
                              };
                              setSelectedSchool(formData);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-[#1A1F2C]">Edit School Details</DialogTitle>
                          </DialogHeader>
                          {selectedSchool && <SchoolOnboardingForm initialData={selectedSchool} />}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-[#1A1F2C]">
                    No schools found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminOnboarding;