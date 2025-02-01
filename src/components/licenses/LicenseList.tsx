import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const LicenseList = () => {
  const { data: licenses, isLoading } = useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      console.log('Fetching licenses...');
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          schools (
            school_name,
            school_app_id
          )
        `);
      
      if (error) {
        console.error('Error fetching licenses:', error);
        throw error;
      }
      console.log('Fetched licenses:', data);
      return data;
    }
  });

  if (isLoading) {
    return <p className="text-white">Loading licenses...</p>;
  }

  if (!licenses?.length) {
    return <p className="text-white">No licenses found</p>;
  }

  return (
    <div className="space-y-4">
      {licenses.map((license) => (
        <div
          key={license.id}
          className="p-6 border border-primary-600 rounded-lg bg-[#1A1F2C] hover:bg-primary-600 transition-colors"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="font-medium text-white">
                {license.schools?.school_name} ({license.schools?.school_app_id})
              </p>
              <p className="text-sm text-gray-300">
                Expires: {format(new Date(license.expiry_date), 'PP')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center justify-center ${
                license.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {license.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};