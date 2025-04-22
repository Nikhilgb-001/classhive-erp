
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { Plus } from "lucide-react";

export const OnboardingHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">School Onboarding</h1>
        <p className="text-gray-500 mt-2">Manage school onboarding process</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
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
  );
};
