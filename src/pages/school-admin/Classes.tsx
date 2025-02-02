import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassConfigurationForm } from "@/components/class/ClassConfigurationForm";

const Classes = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

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
            <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <ClassConfigurationForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Classes;