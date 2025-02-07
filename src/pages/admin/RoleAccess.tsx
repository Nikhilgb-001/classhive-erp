import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RoleAccessForm } from "@/components/role/RoleAccessForm";
import { EditRoleDialog } from "@/components/role/EditRoleDialog";
import { RoleCard } from "@/components/role/RoleCard";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

type UserRole = {
  id: string;
  role: AppRole;
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
      if (!session) return [];

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

      const { data: authUsers, error: authError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .in('id', userRoles.map(role => role.user_id));

      if (authError) throw authError;

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

      const userDetails = userRoles.map(role => {
        const authUser = authUsers?.find(user => user.id === role.user_id);
        const schoolDetail = schoolDetails.find(s => s?.userId === role.user_id);
        
        return {
          ...role,
          email: authUser?.email,
          schoolDetails: schoolDetail?.school
        };
      });

      return userDetails as UserRole[];
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
                <RoleAccessForm onSuccess={() => refetch()} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <p>Loading role permissions...</p>
          ) : rolePermissions && rolePermissions.length > 0 ? (
            rolePermissions.map((permission) => (
              <RoleCard
                key={permission.id}
                {...permission}
                onEdit={() => setEditingRole(permission)}
                onDelete={() => handleDelete(permission.id)}
              />
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