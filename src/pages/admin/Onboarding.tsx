import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleExportCSV = () => {
    if (!schools || schools.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Convert schools data to CSV format
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

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent text-gray-900"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">School Onboarding</h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              onClick={() => navigate('/admin/onboarding/new')}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Onboarding
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-700">SCHOOL NAME</TableHead>
                <TableHead className="text-gray-700">ADMIN NAME</TableHead>
                <TableHead className="text-gray-700">STATUS</TableHead>
                <TableHead className="text-gray-700">CREATED AT</TableHead>
                <TableHead className="text-gray-700">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : schools && schools.length > 0 ? (
                schools.map((school) => (
                  <TableRow key={school.id} className="border-gray-200">
                    <TableCell className="text-gray-900">{school.school_name}</TableCell>
                    <TableCell className="text-gray-900">{school.admin_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        school.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {school.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {format(new Date(school.created_at), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Dialog open={isEditDialogOpen && selectedSchool?.id === school.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setSelectedSchool(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="text-primary hover:text-primary-600 hover:bg-primary-50"
                            onClick={() => setSelectedSchool(school)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit School Details</DialogTitle>
                          </DialogHeader>
                          <SchoolOnboardingForm initialData={selectedSchool} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">No schools found</TableCell>
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