import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeaderActions } from "./HeaderActions";
import { School } from "@/types/school";

interface OnboardingHeaderProps {
  isSuperAdmin: boolean;
  hasSchools: boolean;
  schools?: School[];
}

export const OnboardingHeader = ({ isSuperAdmin, hasSchools, schools = [] }: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          className="p-0 hover:bg-transparent text-[#1A1F2C]"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#1A1F2C]">
          {isSuperAdmin ? 'All Schools Management' : 'School Management'}
        </h1>
      </div>
      <HeaderActions hasSchools={hasSchools} schools={schools} />
    </>
  );
};