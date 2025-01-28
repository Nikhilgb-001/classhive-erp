import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";

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
          <Button 
            onClick={() => navigate('/admin/onboarding/new')}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Onboarding
          </Button>
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
                  <TableCell colSpan={5} className="text-center text-gray-700">Loading...</TableCell>
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
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-primary-600 hover:bg-primary-50"
                        onClick={() => navigate(`/admin/onboarding/${school.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-700">No schools found</TableCell>
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