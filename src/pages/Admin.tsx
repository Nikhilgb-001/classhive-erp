import { School, Users, FileText, Rocket, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminFeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  href,
  iconColor = "#4F46E5"
}: { 
  icon: any;
  title: string;
  description: string;
  href: string;
  iconColor?: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-200 bg-[#E5DEFF]">
    <a href={href}>
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </a>
  </Card>
);

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

const Admin = () => {
  const features = [
    {
      icon: School,
      title: "Schools",
      description: "Manage schools and their configurations",
      href: "/admin/schools",
      iconColor: "#4F46E5"
    },
    {
      icon: Users,
      title: "Users",
      description: "Manage users and their roles",
      href: "/admin/users",
      iconColor: "#34D399"
    },
    {
      icon: FileText,
      title: "Licenses",
      description: "Manage school licenses and subscriptions",
      href: "/admin/licenses",
      iconColor: "#F472B6"
    },
    {
      icon: Rocket,
      title: "Onboarding",
      description: "Manage school onboarding process",
      href: "/admin/onboarding",
      iconColor: "#A78BFA"
    },
    {
      icon: Lock,
      title: "Role Access",
      description: "Manage platform access and roles",
      href: "/admin/role-access",
      iconColor: "#FBBF24"
    }
  ];

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

  console.log('Fetched schools:', schools);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your platform settings and configurations</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>New School Onboarding</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Onboard New School</DialogTitle>
              </DialogHeader>
              <SchoolOnboardingForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <AdminFeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent School Onboardings</h2>
          {isLoading ? (
            <p>Loading schools...</p>
          ) : schools && schools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default Admin;