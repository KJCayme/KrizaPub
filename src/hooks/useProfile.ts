
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '../integrations/supabase/types';

type Profile = Tables<'profile'>;

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Updating profile with:', updates);
      
      // First try to update existing profile
      const { data: updateData, error: updateError } = await supabase
        .from('profile')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError && updateError.code === 'PGRST116') {
        // Profile doesn't exist, so create it
        console.log('Profile not found, creating new profile...');
        
        const profileData = {
          id: user.id,
          name: 'Kenneth John Cayme',
          roles: 'General Virtual Assistant, Social Media Manager, Project Manager, Graphic Designer, Copywriter, a FRIEND if needed',
          caption: 'Empowering businesses through exceptional virtual assistance',
          ...updates
        };

        const { data: insertData, error: insertError } = await supabase
          .from('profile')
          .insert(profileData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return { error: insertError };
        }

        console.log('Profile created successfully:', insertData);
        setProfile(insertData);
        return { data: insertData };
      }

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return { error: updateError };
      }

      console.log('Profile updated successfully:', updateData);
      setProfile(updateData);
      return { data: updateData };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const uploadProfileImage = async (file: File) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Starting profile image upload for user:', user.id);
      
      // Delete existing image if it exists
      if (profile?.profile_image) {
        const oldPath = profile.profile_image.split('/').pop();
        if (oldPath) {
          console.log('Deleting old image:', oldPath);
          await supabase.storage.from('portfolio').remove([`profiles/${oldPath}`]);
        }
      }

      // Upload new image to profiles folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      console.log('Uploading new image to:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { error: uploadError };
      }

      // Get public URL with cache busting
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      // Add timestamp to prevent caching issues
      const imageUrlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      console.log('Image uploaded successfully, public URL:', imageUrlWithCacheBuster);

      // Update profile with new image URL using the updateProfile method
      const result = await updateProfile({ profile_image: imageUrlWithCacheBuster });
      
      if (result.error) {
        console.error('Error updating profile with new image URL:', result.error);
        return result;
      }

      console.log('Profile image updated in database successfully');
      // Refetch profile to ensure we have the latest data
      await fetchProfile();
      return result;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return { error };
    }
  };

  const uploadResume = async (file: File) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Starting resume upload for user:', user.id);
      
      // Delete existing resume if it exists
      if (profile?.resume_url) {
        const oldPath = profile.resume_url.split('/').pop();
        if (oldPath) {
          console.log('Deleting old resume:', oldPath);
          await supabase.storage.from('portfolio').remove([`resumes/${oldPath}`]);
        }
      }

      // Upload new resume to resumes folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      console.log('Uploading resume to:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading resume:', uploadError);
        return { error: uploadError };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      console.log('Resume uploaded successfully, public URL:', publicUrl);

      // Update profile with new resume data
      const result = await updateProfile({ 
        resume_url: publicUrl,
        resume_filename: file.name,
        resume_uploaded_at: new Date().toISOString()
      });
      
      if (result.error) {
        console.error('Error updating profile with new resume:', result.error);
        return result;
      }

      console.log('Resume updated in database successfully');
      return result;
    } catch (error) {
      console.error('Error uploading resume:', error);
      return { error };
    }
  };

  const deleteResume = async () => {
    if (!user) return { error: 'Not authenticated' };
    if (!profile?.resume_url) return { error: 'No resume to delete' };

    try {
      console.log('Deleting resume for user:', user.id);
      
      // Delete file from storage
      const oldPath = profile.resume_url.split('/').pop();
      if (oldPath) {
        console.log('Deleting resume file:', oldPath);
        await supabase.storage.from('portfolio').remove([`resumes/${oldPath}`]);
      }

      // Update profile to remove resume data
      const result = await updateProfile({ 
        resume_url: null,
        resume_filename: null,
        resume_uploaded_at: null
      });
      
      if (result.error) {
        console.error('Error removing resume from profile:', result.error);
        return result;
      }

      console.log('Resume deleted successfully');
      return result;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updateProfile,
    uploadProfileImage,
    uploadResume,
    deleteResume,
    fetchProfile,
  };
};
