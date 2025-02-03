import { Button } from "@/components/ui/button";
import { Plus, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { School } from "@/types/school";

interface OnboardingHeaderProps {
  isSuperAdmin: boolean;
  hasSchools: boolean;
  schools?: School[];
}

export const OnboardingHeader = ({ isSuperAdmin, hasSchools, schools = [] }: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    if (!hasSchools) {
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

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          className="p-0 hover:bg-transparent text-[#1A1F2C]"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1A1F2C]">
          {isSuperAdmin ? 'All Schools Management' : 'School Management'}
        </h1>
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
          New School
        </Button>
      </div>
    </>
  );
};