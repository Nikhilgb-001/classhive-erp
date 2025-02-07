import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RoleAccessForm } from "@/components/role/RoleAccessForm";

const RoleAccess = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

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

  const { data: rolePermissions, isLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      console.log('Fetching role permissions...');
      if (!session) {
        console.log('No session found, skipping fetch');
        return [];
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          role,
          user_id,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching role permissions:', error);
        throw error;
      }
      console.log('Fetched role permissions:', data);
      return data;
    },
    enabled: !!session,
    retry: 3,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Role Access Management</h1>
            <p className="text-gray-500 mt-2">Configure platform access and role permissions</p>
          </div>
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

        <div className="grid gap-6">
          {isLoading ? (
            <p>Loading role permissions...</p>
          ) : rolePermissions && rolePermissions.length > 0 ? (
            rolePermissions.map((permission) => (
              <Card key={permission.id} className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 capitalize">{permission.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">User ID</p>
                      <p className="text-gray-900">{permission.user_id}</p>
                    </div>
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
      </div>
    </AppLayout>
  );
};

export default RoleAccess;