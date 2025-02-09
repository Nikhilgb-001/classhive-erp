
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  admission_number: string | null;
  class: string | null;
  section: string | null;
  status: string | null;
}

const Students = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch students data
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      console.log('Fetching students data');
      // Get the school_id from localStorage
      const schoolId = localStorage.getItem('schoolId');
      
      if (!schoolId) {
        console.error('No school ID found');
        return [];
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch students data",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Students data:', data);
      return data as Student[];
    }
  });

  const handleExportCSV = () => {
    toast({
      title: "Coming Soon",
      description: "CSV export feature will be available soon",
    });
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">Student Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate('/school-admin/students/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading students data...</div>
        ) : students && students.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow 
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/school-admin/students/${student.id}`)}
                  >
                    <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                    <TableCell>{student.admission_number || '-'}</TableCell>
                    <TableCell>{student.class || '-'}</TableCell>
                    <TableCell>{student.section || '-'}</TableCell>
                    <TableCell>
                      {student.email || student.phone || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status || 'inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No students found. Add your first student to get started.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Students;
