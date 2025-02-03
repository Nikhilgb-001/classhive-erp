import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SchoolOnboardingForm } from "@/components/SchoolOnboardingForm";
import { useState } from "react";
import { School, SchoolFormData } from "@/types/school";
import { SchoolTableRow } from "./SchoolTableRow";

interface SchoolListProps {
  schools: School[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const SchoolList = ({ schools, isLoading, error }: SchoolListProps) => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolFormData | null>(null);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Schools</h3>
          <p className="text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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
              <Dialog key={school.id}>
                <DialogTrigger asChild>
                  <div>
                    <SchoolTableRow 
                      school={school} 
                      onEdit={setSelectedSchool} 
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-[#1A1F2C]">Edit School Details</DialogTitle>
                  </DialogHeader>
                  {selectedSchool && <SchoolOnboardingForm initialData={selectedSchool} />}
                </DialogContent>
              </Dialog>
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