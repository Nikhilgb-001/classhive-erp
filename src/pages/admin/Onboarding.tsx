import { AppLayout } from "@/components/layouts/AppLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { useSchools } from "@/hooks/useSchools";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { SchoolList } from "@/components/onboarding/SchoolList";

const AdminOnboarding = () => {
  const { data: userRole } = useUserRole();
  const isSuperAdmin = userRole === 'super_admin';
  
  const { data: schools, isLoading, error } = useSchools(isSuperAdmin, userRole !== undefined);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 bg-[#F1F1F1] min-h-screen p-6">
        <OnboardingHeader 
          isSuperAdmin={isSuperAdmin} 
          hasSchools={Boolean(schools?.length)}
          schools={schools}
        />
        <SchoolList 
          schools={schools} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </AppLayout>
  );
};

export default AdminOnboarding;