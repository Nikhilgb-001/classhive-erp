import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Edit, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RoleAccessForm } from "@/components/role/RoleAccessForm";
import { EditRoleDialog } from "@/components/role/EditRoleDialog";
import { Database } from "@/integrations/supabase/types";

type UserRole = {
  id: string;
  role: Database["public"]["Enums"]["app_role"];
  user_id: string;
  created_at: string;
  user_details?: {
    name?: string | null;
    phone?: string | null;
    school_id?: string | null;
  } | null;
  email?: string;
  schoolDetails?: {
    school_name: string;
    school_code: string;
    school_address: string;
  } | null;
};

const RoleAccess = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);

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

  const { data: rolePermissions, isLoading, refetch } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      console.log('Fetching role permissions...');
      if (!session) {
        console.log('No session found, skipping fetch');
        return [];
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          role,
          user_id,
          created_at,
          user_details:user_details(
            name,
            phone,
            school_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (rolesError) throw rolesError;

      // Fetch user emails from auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .in('id', userRoles.map(role => role.user_id));

      if (authError) throw authError;

      // Fetch school details for relevant roles
      const schoolDetails = await Promise.all(
        userRoles
          .filter(role => ['school_admin', 'teacher', 'student'].includes(role.role))
          .map(async (role) => {
            if (!role.user_details?.school_id) return null;
            
            const { data: school } = await supabase
              .from('schools')
              .select('*')
              .eq('id', role.user_details.school_id)
              .single();
            
            return { userId: role.user_id, school };
          })
      );

      // Combine all the data
      const userDetails = userRoles.map(role => {
        const authUser = authUsers.find(user => user.id === role.user_id);
        const schoolDetail = schoolDetails.find(s => s?.userId === role.user_id);
        
        return {
          ...role,
          email: authUser?.email,
          user_details: role.user_details || {},
          schoolDetails: schoolDetail?.school
        };
      });

      console.log('Fetched role permissions with details:', userDetails);
      return userDetails;
    },
    enabled: !!session,
    retry: 3,
    staleTime: 1000 * 60 * 5,
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Role permission deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting role permission:', error);
      toast.error("Failed to delete role permission");
    }
  };

  const exportToCSV = () => {
    if (!rolePermissions?.length) return;

    const headers = [
      'ID', 
      'Role', 
      'User ID', 
      'Name', 
      'Email', 
      'School Name',
      'School Code', 
      'School Address',
      'Created At'
    ];

    const csvData = rolePermissions.map(permission => [
      permission.id,
      permission.role,
      permission.user_id,
      permission.user_details?.name || 'N/A',
      permission.email || 'N/A',
      permission.schoolDetails?.school_name || 'N/A',
      permission.schoolDetails?.school_code || 'N/A',
      permission.schoolDetails?.school_address || 'N/A',
      new Date(permission.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'role-permissions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Role Access Management</h1>
            <p className="text-gray-500 mt-2">Configure platform access and role permissions</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Role Permission
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Role Permission</DialogTitle>
                </DialogHeader>
                <RoleAccessForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <p>Loading role permissions...</p>
          ) : rolePermissions && rolePermissions.length > 0 ? (
            rolePermissions.map((permission) => (
              <Card key={permission.id} className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl text-gray-900 capitalize">
                    {permission.role}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setEditingRole(permission)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDelete(permission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">User ID</p>
                      <p className="text-gray-900">{permission.user_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{permission.user_details?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{permission.email || 'N/A'}</p>
                    </div>
                    {['school_admin', 'teacher', 'student'].includes(permission.role) && permission.schoolDetails && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">School</p>
                          <p className="text-gray-900">{permission.schoolDetails.school_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">School Code</p>
                          <p className="text-gray-900">{permission.schoolDetails.school_code}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">School Address</p>
                          <p className="text-gray-900">{permission.schoolDetails.school_address}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created At</p>
                      <p className="text-gray-900">{new Date(permission.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No role permissions configured yet.</p>
          )}
        </div>

        <EditRoleDialog 
          isOpen={!!editingRole}
          onClose={() => setEditingRole(null)}
          roleData={editingRole}
        />
      </div>
    </AppLayout>
  );
};

export default RoleAccess;
