import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Users, BookOpen, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SchoolAdminFeatureCard = ({ 
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
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 bg-white cursor-pointer"
      onClick={() => navigate(href)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="w-12 h-12 bg-[#F1F1F1] rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-6 h-6" style={{ color: iconColor }} />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1F2C] mb-2">{title}</h3>
            <p className="text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SchoolAdmin = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: BookOpen,
      title: "Class Management",
      description: "Manage classes, sections, and subjects",
      href: "/school-admin/classes",
      iconColor: "#34D399"
    },
    {
      icon: GraduationCap,
      title: "Teacher Management",
      description: "Manage teachers and their assignments",
      href: "/school-admin/teachers",
      iconColor: "#F472B6"
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Manage students and their information",
      href: "/school-admin/students",
      iconColor: "#A78BFA"
    }
  ];

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          </div>
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <SchoolAdminFeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SchoolAdmin;