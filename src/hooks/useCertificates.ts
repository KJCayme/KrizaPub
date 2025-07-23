
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Certificate {
  id: string;
  name: string;
  year: string;
  issued_by: string;
  caption?: string;
  skills_covered: string[];
  link?: string;
  certificate_image_card: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  title_color?: string;
}

export const useCertificates = (limit?: number) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCertificates = async (fetchLimit?: number) => {
    try {
      setLoading(true);
      let query = supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchLimit) {
        query = query.limit(fetchLimit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Sort certificates by year (latest to oldest)
      const sortedCertificates = (data || []).sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA; // Descending order (latest first)
      });

      setCertificates(sortedCertificates);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCertificate = async (certificateData: Omit<Certificate, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('User must be logged in to add certificates');

    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          ...certificateData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Re-fetch and sort certificates after adding
      await fetchCertificates(limit);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCertificates(limit);
  }, [limit]);

  return {
    certificates,
    loading,
    error,
    addCertificate,
    refetch: () => fetchCertificates(limit),
    fetchAll: () => fetchCertificates()
  };
};
