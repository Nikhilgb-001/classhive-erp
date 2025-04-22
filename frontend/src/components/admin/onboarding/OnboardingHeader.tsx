
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Plus } from "lucide-react";

interface OnboardingHeaderProps {
  onBack: () => void;
  onExport: () => void;
  onNew: () => void;
}

export const OnboardingHeader = ({ onBack, onExport, onNew }: OnboardingHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          className="p-0 hover:bg-transparent text-[#1A1F2C]"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1A1F2C]">School Onboarding</h1>
      </div>
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button 
          onClick={onNew}
          className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Onboarding
        </Button>
      </div>
    </>
  );
};
