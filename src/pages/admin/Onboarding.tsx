import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const SchoolCard = ({ school }: { school: any }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{school.school_name}</h3>
          <p className="text-sm text-gray-500">ID: {school.school_app_id}</p>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          {school.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Admin:</span> {school.admin_name}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {school.admin_email}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> {school.admin_phone}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Address:</span> {school.school_address}
        </p>
      </div>
    </CardContent>
  </Card>
);

const AdminOnboarding = () => {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">School Onboarding</h1>
            <p className="text-gray-500">Manage the onboarding process for new schools</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Onboarded Schools</h2>
          {isLoading ? (
            <p>Loading schools...</p>
          ) : schools && schools.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No schools onboarded yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminOnboarding;