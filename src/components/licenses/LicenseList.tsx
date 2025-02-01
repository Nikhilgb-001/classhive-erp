import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LicenseList = () => {
  const { data: licenses, isLoading } = useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          schools (
            school_name,
            school_code
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-white">Loading licenses...</div>;
  }

  if (!licenses?.length) {
    return <div className="text-white">No licenses found.</div>;
  }

  return (
    <div className="space-y-4">
      {licenses.map((license) => (
        <Card key={license.id} className="bg-[#1A1F2C] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {license.schools?.school_name || 'Unknown School'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">School Code</p>
                <p className="text-white">{license.schools?.school_code || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  license.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {license.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created At</p>
                <p className="text-white">{format(new Date(license.created_at), 'MM/dd/yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Expiry Date</p>
                <p className="text-white">{format(new Date(license.expiry_date), 'MM/dd/yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};