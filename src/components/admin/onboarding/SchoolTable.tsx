
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface School {
  id: string;
  school_name: string;
  school_code: string;
  school_address: string;
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  billing_contact_name: string;
  billing_phone: string;
  billing_email: string;
  founder_name: string;
  founder_phone: string;
  logo_url?: string;
  status?: string;
  created_at: string;
}

interface SchoolTableProps {
  schools: School[] | null;
  isLoading: boolean;
  onSchoolSelect: (school: any) => void;
}

export const SchoolTable = ({ schools, isLoading, onSchoolSelect }: SchoolTableProps) => {
  return (
    <div className="bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow className="border-[#1A1F2C]/10">
            <TableHead className="text-[#1A1F2C]">SCHOOL NAME</TableHead>
            <TableHead className="text-[#1A1F2C]">ADMIN NAME</TableHead>
            <TableHead className="text-[#1A1F2C]">STATUS</TableHead>
            <TableHead className="text-[#1A1F2C]">CREATED AT</TableHead>
            <TableHead className="text-[#1A1F2C]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
              </TableRow>
            ))
          ) : schools && schools.length > 0 ? (
            schools.map((school) => (
              <TableRow key={school.id} className="border-[#1A1F2C]/10">
                <TableCell className="text-[#1A1F2C] font-medium">
                  {school.school_name}
                </TableCell>
                <TableCell className="text-[#1A1F2C]">{school.admin_name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    school.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {school.status || 'pending'}
                  </span>
                </TableCell>
                <TableCell className="text-[#1A1F2C]">
                  {format(new Date(school.created_at), 'MM/dd/yyyy')}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          const formData = {
                            schoolName: school.school_name,
                            schoolCode: school.school_code,
                            schoolAddress: school.school_address,
                            adminName: school.admin_name,
                            adminEmail: school.admin_email,
                            adminPhone: school.admin_phone,
                            billingContactName: school.billing_contact_name,
                            billingPhone: school.billing_phone,
                            billingEmail: school.billing_email,
                            founderName: school.founder_name,
                            founderPhone: school.founder_phone,
                            logoUrl: school.logo_url,
                          };
                          onSchoolSelect(formData);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-[#1A1F2C]">Edit School Details</DialogTitle>
                      </DialogHeader>
                      <SchoolOnboardingForm initialData={school} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-[#1A1F2C]">
                No schools found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
