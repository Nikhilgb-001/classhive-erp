import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassConfigurationList } from "@/components/class/ClassConfigurationList";

const Classes = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-primary">Class Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate('/school-admin/classes/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <ClassConfigurationList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Classes;