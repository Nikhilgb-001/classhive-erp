import { AppLayout } from "@/components/layouts/AppLayout";
import { CreateLicenseForm } from "@/components/licenses/CreateLicenseForm";
import { LicenseList } from "@/components/licenses/LicenseList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Licenses = () => {
  const navigate = useNavigate();

  const handleExportCSV = async () => {
    console.log("Exporting licenses to CSV...");
    const { data: licenses } = await supabase
      .from('licenses')
      .select(`
        *,
        schools (
          school_name,
          school_code
        )
      `)
      .order('created_at', { ascending: false });

    if (!licenses) return;

    const csvContent = [
      // CSV Headers
      ['School Name', 'School Code', 'Status', 'Created At', 'Expiry Date'].join(','),
      // CSV Data
      ...licenses.map(license => [
        license.schools?.school_name || 'Unknown School',
        license.schools?.school_code || 'N/A',
        license.status,
        format(new Date(license.created_at), 'MM/dd/yyyy'),
        format(new Date(license.expiry_date), 'MM/dd/yyyy')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `licenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">License Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New License
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New License</DialogTitle>
                </DialogHeader>
                <CreateLicenseForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <LicenseList />
      </div>
    </AppLayout>
  );
};

export default Licenses;