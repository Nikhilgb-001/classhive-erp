
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRoleData {
  role: AppRole | null;
  schoolId: string | null;
}

export const useUserRole = () => {
  const [roleData, setRoleData] = useState<UserRoleData>({ role: null, schoolId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role, school_id')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            return;
          }

          if (data) {
            setRoleData({
              role: data.role,
              schoolId: data.school_id || null
            });

            // Store schoolId in localStorage if it exists
            if (data.school_id) {
              localStorage.setItem('schoolId', data.school_id);
            }
          }
        }
      } catch (error) {
        console.error('Error in useUserRole:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setRoleData({ role: null, schoolId: null });
        localStorage.removeItem('schoolId');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { ...roleData, loading };
};
