import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
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

  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('Fetching schools...');
      if (!session) {
        console.log('No session found, skipping fetch');
        return [];
      }

      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      console.log('Fetched schools:', data);
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
            <h1 className="text-2xl font-bold text-gray-900">School Onboarding</h1>
            <p className="text-gray-500 mt-2">Manage school onboarding process</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New School Onboarding
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Onboard New School</DialogTitle>
              </DialogHeader>
              <SchoolOnboardingForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <p>Loading schools...</p>
          ) : schools && schools.length > 0 ? (
            schools.map((school) => (
              <Card key={school.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{school.school_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">School ID</p>
                      <p>{school.school_app_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">School Code</p>
                      <p>{school.school_code}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Admin</p>
                      <p>{school.admin_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact</p>
                      <p>{school.admin_phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No schools onboarded yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Onboarding;