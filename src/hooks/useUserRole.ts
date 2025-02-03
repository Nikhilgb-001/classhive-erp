import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      try {
        console.log('Checking user role...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No user found');
          return null;
        }
        console.log('User ID:', user.id);

        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin')
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          throw error;
        }

        console.log('Role data:', roleData);
        return roleData?.role;
      } catch (error) {
        console.error('Error in userRole query:', error);
        return null;
      }
    }
  });
};