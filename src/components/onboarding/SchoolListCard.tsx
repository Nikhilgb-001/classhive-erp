
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface School {
  id: string;
  school_app_id: string;
  school_name: string;
  school_code: string;
  admin_name: string;
  admin_phone: string;
  status: string;
  created_at: string;
  schema_name?: string;
}

interface SchoolListCardProps {
  school: School;
}

export const SchoolListCard = ({ school }: SchoolListCardProps) => {
  return (
    <Card key={school.id} className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl">{school.school_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">School ID</p>
            <p>{school.school_app_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">School Code</p>
            <p>{school.school_code}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Admin</p>
            <p>{school.admin_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Contact</p>
            <p>{school.admin_phone}</p>
          </div>
          {school.schema_name && (
            <div>
              <p className="text-sm font-medium text-gray-500">Schema Name</p>
              <p>{school.schema_name}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
