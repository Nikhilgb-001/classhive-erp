import { AppLayout } from "@/components/layouts/AppLayout";
import { ClassConfigurationForm } from "@/components/class/ClassConfigurationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewClass = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="w-full space-y-6 bg-[#F1F1F1] min-h-screen p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent text-[#1A1F2C]"
            onClick={() => navigate('/school-admin/classes')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#1A1F2C]">Add New Class</h1>
        </div>
        <div className="w-full max-w-[1400px] mx-auto">
          <ClassConfigurationForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewClass;