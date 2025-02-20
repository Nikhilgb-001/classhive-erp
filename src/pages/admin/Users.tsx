
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoleAccessForm } from "@/components/role/RoleAccessForm";
import { useUserRole } from "@/hooks/useUserRole";
import type { Database } from "@/integrations/supabase/types";

type UserDetails = Database["public"]["Tables"]["user_details"]["Row"] & {
  user_roles: {
    role: Database["public"]["Enums"]["app_role"];
    school_id: string;
  };
  schools: {
    school_name: string;
  }[];
};

const AdminUsers = () => {
  const [session, setSession] = useState(null);
  const { role: currentUserRole, schoolId: currentUserSchoolId } = useUserRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        toast.error("Please login to continue");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users-management'],
    queryFn: async () => {
      if (!session) return [];

      let query = supabase
        .from('user_details')
        .select(`
          *,
          user_roles!inner (
            role,
            school_id
          ),
          schools!user_roles (
            school_name
          )
        `);

      // If school admin, only show users from their school
      if (currentUserRole === 'school_admin' && currentUserSchoolId) {
        query = query.eq('school_id', currentUserSchoolId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data as UserDetails[];
    },
    enabled: !!session && !!currentUserRole,
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Users Management</h1>
            <p className="text-gray-500">Manage users and their roles across the platform</p>
          </div>
          {(currentUserRole === 'super_admin' || currentUserRole === 'school_admin') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <RoleAccessForm onSuccess={() => refetch()} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-4">Loading users...</div>
          ) : users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.user_id || 'N/A'}</TableCell>
                    <TableCell className="capitalize">
                      {user.user_roles?.role?.replace('_', ' ') || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.schools?.[0]?.school_name || 'N/A'}
                    </TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <RoleAccessForm 
                            initialData={user} 
                            onSuccess={() => refetch()} 
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
