import { AppLayout } from "@/components/layouts/AppLayout";
import { CreateLicenseForm } from "@/components/licenses/CreateLicenseForm";
import { LicenseList } from "@/components/licenses/LicenseList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const Licenses = () => {
  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">License Management</h1>
            <p className="text-gray-500 mt-2">Manage school licenses</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New License
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New License</DialogTitle>
              </DialogHeader>
              <CreateLicenseForm />
            </DialogContent>
          </Dialog>
        </div>
        <LicenseList />
      </div>
    </AppLayout>
  );
};

export default Licenses;