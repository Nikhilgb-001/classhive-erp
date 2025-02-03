import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus, Pencil } from "lucide-react";
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

const Teachers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // First, fetch the school ID
  const { data: schoolData } = useQuery({
    queryKey: ['school'],
    queryFn: async () => {
      console.log('Fetching school data');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('schools')
        .select('id')
        .eq('admin_email', user.email)
        .single();

      if (error) {
        console.error('Error fetching school:', error);
        throw error;
      }

      console.log('School data fetched:', data);
      return data;
    },
  });

  // Then fetch teachers for that school
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers', schoolData?.id],
    queryFn: async () => {
      if (!schoolData?.id) return [];
      
      console.log('Fetching teachers for school:', schoolData.id);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('school_id', schoolData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch teachers",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Teachers fetched:', data);
      return data;
    },
    enabled: !!schoolData?.id,
  });

  const handleEdit = (teacherId: string) => {
    // Will implement edit functionality in the next iteration
    console.log('Edit teacher:', teacherId);
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon",
    });
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
            <h1 className="text-2xl font-bold text-primary">Teacher Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate('/school-admin/teachers/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading teachers...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Primary Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{`${teacher.first_name} ${teacher.last_name}`}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.class || '-'}</TableCell>
                      <TableCell>{teacher.section || '-'}</TableCell>
                      <TableCell>{teacher.primary_subject || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          teacher.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(teacher.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No teachers found. Add your first teacher to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Teachers;