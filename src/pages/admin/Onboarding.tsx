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

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent text-white"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-white">School Onboarding</h1>
          </div>
          <Button 
            onClick={() => navigate('/admin/onboarding/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Onboarding
          </Button>
        </div>

        <div className="rounded-md border border-gray-800 bg-[#1E2433] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">SCHOOL NAME</TableHead>
                <TableHead className="text-gray-300">ADMIN NAME</TableHead>
                <TableHead className="text-gray-300">STATUS</TableHead>
                <TableHead className="text-gray-300">CREATED AT</TableHead>
                <TableHead className="text-gray-300">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-300">Loading...</TableCell>
                </TableRow>
              ) : schools && schools.length > 0 ? (
                schools.map((school) => (
                  <TableRow key={school.id} className="border-gray-800">
                    <TableCell className="text-gray-200">{school.school_name}</TableCell>
                    <TableCell className="text-gray-200">{school.admin_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        school.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {school.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {format(new Date(school.created_at), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        onClick={() => navigate(`/admin/onboarding/${school.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-300">No schools found</TableCell>
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