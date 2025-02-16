
import { AppLayout } from "@/components/layouts/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { SchoolList } from "@/components/onboarding/SchoolList";

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
        <OnboardingHeader />
        <SchoolList schools={schools} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
};

export default Onboarding;
