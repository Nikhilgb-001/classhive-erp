import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Students = () => {
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
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Students;