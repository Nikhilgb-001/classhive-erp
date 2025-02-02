import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassConfigurationList } from "@/components/class/ClassConfigurationList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Classes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExportCSV = async () => {
    try {
      console.log('Fetching class configurations for CSV export');
      const { data: configurations, error } = await supabase
        .from('class_configurations')
        .select(`
          id,
          schools:school_id (
            school_name,
            school_code
          ),
          classes,
          sections,
          subjects
        `);

      if (error) {
        console.error('Error fetching configurations:', error);
        throw error;
      }

      if (!configurations || configurations.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no class configurations to export.",
          variant: "destructive",
        });
        return;
      }

      console.log('Processing configurations for CSV:', configurations);

      // Convert the data to CSV format with proper column structure
      const headers = ['School Name', 'School Code', 'Classes', 'Sections', 'Subjects'];
      const csvRows = [headers];

      configurations.forEach((config) => {
        // Create a single row with each array joined into a single cell
        csvRows.push([
          config.schools?.school_name || 'N/A',
          config.schools?.school_code || 'N/A',
          Array.isArray(config.classes) ? config.classes.join(' ') : '',
          Array.isArray(config.sections) ? config.sections.join(' ') : '',
          Array.isArray(config.subjects) ? config.subjects.join(' ') : ''
        ]);
      });

      // Create CSV content with proper escaping for cells containing commas
      const csvContent = csvRows.map(row => 
        row.map(cell => 
          // Wrap cells in quotes and escape existing quotes
          `"${String(cell).replace(/"/g, '""')}"`
        ).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'class_configurations.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Class configurations have been exported to CSV.",
      });

    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export class configurations. Please try again.",
        variant: "destructive",
      });
    }
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
            <h1 className="text-2xl font-bold text-primary">Class Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate('/school-admin/classes/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <ClassConfigurationList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Classes;