import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { School, SchoolFormData } from "@/types/school";

interface SchoolTableRowProps {
  school: School;
  onEdit: (data: SchoolFormData) => void;
}

export const SchoolTableRow = ({ school, onEdit }: SchoolTableRowProps) => {
  const mapSchoolToFormData = (school: School): SchoolFormData => ({
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
  });

  return (
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
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100"
          onClick={() => onEdit(mapSchoolToFormData(school))}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};