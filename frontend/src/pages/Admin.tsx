import { Users, FileText, Rocket, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layouts/AppLayout";
import { useNavigate } from "react-router-dom";

const AdminFeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  href,
  iconColor = "#4F46E5",
  children 
}: { 
  icon: any;
  title: string;
  description: string;
  href: string;
  iconColor?: string;
  children?: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(`Navigating to: ${href}`);
    navigate(href);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="w-12 h-12 bg-[#F1F1F1] rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-6 h-6" style={{ color: iconColor }} />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1F2C] mb-2">{title}</h3>
            <p className="text-gray-500 text-left">{description}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const features = [
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
      description: "Manage school onboarding process.",
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

  return (
    <AppLayout>
      <div className="space-y-6 bg-[#F1F1F1] min-h-screen p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F2C]">Super Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your platform settings and configurations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <AdminFeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Admin;