import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSchools = (isSuperAdmin: boolean, enabled: boolean) => {
  return useQuery({
    queryKey: ['schools', isSuperAdmin],
    queryFn: async () => {
      console.log('Fetching schools as', isSuperAdmin ? 'super admin' : 'school admin');
      try {
        let query = supabase.from('schools').select('*');
        
        if (!isSuperAdmin) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user?.email) throw new Error('No user email found');
          query = query.eq('admin_email', user.email);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching schools:', error);
          throw error;
        }
        console.log('Fetched schools:', data);
        return data;
      } catch (error) {
        console.error('Error in schools query:', error);
        throw error;
      }
    },
    enabled,
  });
};