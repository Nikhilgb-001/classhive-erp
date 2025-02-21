
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const stats = [
  {
    title: "Total Schools",
    icon: School2,
    description: "Active schools in the platform"
  },
  {
    title: "Total Users",
    icon: Users,
    description: "Active users across all schools"
  }
];

const Index = () => {
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
  }, [navigate]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!session) return null;

      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('status', 'active');

      if (schoolsError) throw schoolsError;

      const { data: users, error: usersError } = await supabase
        .from('user_roles')
        .select('id');

      if (usersError) throw usersError;

      return {
        schools: schools?.length || 0,
        users: users?.length || 0
      };
    },
    enabled: !!session
  });

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to the multi-tenant school management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => navigate('/admin/schools')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Schools
              </CardTitle>
              <School2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats?.schools || 0}
                </div>
                <p className="text-sm text-gray-500">Active schools in the platform</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => navigate('/admin/users')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats?.users || 0}
                </div>
                <p className="text-sm text-gray-500">Active users across all schools</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
