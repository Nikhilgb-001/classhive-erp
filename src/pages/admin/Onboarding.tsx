import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";

const AdminOnboarding = () => {
  const navigate = useNavigate();
  
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

  console.log('Fetched schools:', schools);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">School Onboarding</h1>
          </div>
          <Button 
            onClick={() => navigate('/admin/onboarding/new')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Onboarding
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SCHOOL NAME</TableHead>
                <TableHead>ADMIN NAME</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>CREATED AT</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : schools && schools.length > 0 ? (
                schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>{school.school_name}</TableCell>
                    <TableCell>{school.admin_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        school.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {school.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(school.created_at), 'M/d/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => navigate(`/admin/onboarding/${school.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No schools found</TableCell>
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