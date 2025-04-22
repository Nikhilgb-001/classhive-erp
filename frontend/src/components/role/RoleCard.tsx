import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleCardProps {
  id: string;
  role: AppRole;
  user_id: string;
  user_details?: {
    name?: string | null;
    phone?: string | null;
    school_id?: string | null;
  } | null;
  email?: string;
  schoolDetails?: {
    school_name: string;
    school_code: string;
    school_address: string;
  } | null;
  created_at: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const RoleCard = ({
  id,
  role,
  user_id,
  user_details,
  email,
  schoolDetails,
  created_at,
  onEdit,
  onDelete,
}: RoleCardProps) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl text-gray-900 capitalize">
          {role.replace('_', ' ')}
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">User ID</p>
            <p className="text-gray-900">{user_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-900">{user_details?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900">{email || 'N/A'}</p>
          </div>
          {['school_admin', 'teacher', 'student'].includes(role) && schoolDetails && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">School</p>
                <p className="text-gray-900">{schoolDetails.school_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">School Code</p>
                <p className="text-gray-900">{schoolDetails.school_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">School Address</p>
                <p className="text-gray-900">{schoolDetails.school_address}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-gray-900">{new Date(created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};