
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useHeroRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile')
        .select('roles')
        .single();

      if (error) {
        console.error('Error fetching profile roles:', error);
        setError(error.message);
        // Fallback to default roles if database fetch fails
        setRoles([
          "General Virtual Assistant",
          "Social Media Manager", 
          "Project Manager",
          "Graphic Designer",
          "Copywriter",
          "a FRIEND if needed"
        ]);
      } else {
        // Parse comma-separated roles or use fallback
        const profileRoles = data?.roles 
          ? data.roles.split(',').map(role => role.trim()).filter(role => role.length > 0)
          : [
              "General Virtual Assistant",
              "Social Media Manager", 
              "Project Manager",
              "Graphic Designer",
              "Copywriter",
              "a FRIEND if needed"
            ];
        setRoles(profileRoles);
      }
    } catch (err) {
      console.error('Error fetching profile roles:', err);
      setError('Failed to fetch roles');
      // Fallback to default roles
      setRoles([
        "General Virtual Assistant",
        "Social Media Manager", 
        "Project Manager",
        "Graphic Designer",
        "Copywriter",
        "a FRIEND if needed"
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, loading, error, refetchRoles: fetchRoles };
};
