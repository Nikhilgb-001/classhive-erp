
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RoleAccessForm } from "@/components/role/RoleAccessForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RoleAccess = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        toast.error("Please login to continue");
        navigate('/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      if (!session) return [];

      // First fetch user details
      const { data: userDetails, error: userDetailsError } = await supabase
        .from('user_details')
        .select('id, name, phone, created_at, user_id, school_id');

      if (userDetailsError) {
        console.error('Error fetching user details:', userDetailsError);
        throw userDetailsError;
      }

      // Then fetch roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      // Combine the data
      const combinedData = userDetails.map(user => {
        const userRole = userRoles.find(role => role.user_id === user.user_id);
        return {
          ...user,
          role: userRole?.role || null
        };
      });

      return combinedData;
    },
    enabled: !!session,
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-2">Manage user details</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <RoleAccessForm onSuccess={() => refetch()} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <p className="p-4">Loading users...</p>
          ) : usersData && usersData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell className="capitalize">{user.role?.replace('_', ' ') || 'N/A'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-4">No users found.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RoleAccess;
