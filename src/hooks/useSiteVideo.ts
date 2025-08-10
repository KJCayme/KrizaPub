
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface SiteVideoRow {
  id: string;
  video_path: string;
  poster_path: string | null;
  captions_path: string | null;
  title: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const useSiteVideo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [video, setVideo] = useState<SiteVideoRow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData.session?.user ?? null);
      await fetchActive();
    };
    init();
  }, []);

  const fetchActive = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('site_video')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setVideo(null);
    } else {
      setVideo(data as SiteVideoRow | null);
    }
    setLoading(false);
  }, []);

  const publicVideoUrl = useMemo(() => {
    if (!video?.video_path) return null;
    return supabase.storage.from('videos').getPublicUrl(video.video_path).data.publicUrl;
  }, [video?.video_path]);

  const publicPosterUrl = useMemo(() => {
    if (!video?.poster_path) return null;
    return supabase.storage.from('videos').getPublicUrl(video.poster_path).data.publicUrl;
  }, [video?.poster_path]);

  const publicCaptionsUrl = useMemo(() => {
    if (!video?.captions_path) return null;
    return supabase.storage.from('videos').getPublicUrl(video.captions_path).data.publicUrl;
  }, [video?.captions_path]);

  const uploadAndActivate = useCallback(
    async (
      files: {
        videoFile: File;
        posterFile?: File | null;
        captionsFile?: File | null;
        title?: string;
        description?: string;
      }
    ) => {
      if (!user) {
        throw new Error('You must be signed in to upload a video.');
      }

      // Ensure unique paths
      const timestamp = Date.now();
      const videoPath = `intro/${timestamp}-${files.videoFile.name}`;

      const { error: uploadVideoErr } = await supabase.storage
        .from('videos')
        .upload(videoPath, files.videoFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: files.videoFile.type,
        });
      if (uploadVideoErr) throw uploadVideoErr;

      let posterPath: string | null = null;
      if (files.posterFile) {
        posterPath = `intro/${timestamp}-poster-${files.posterFile.name}`;
        const { error: posterErr } = await supabase.storage
          .from('videos')
          .upload(posterPath, files.posterFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: files.posterFile.type,
          });
        if (posterErr) throw posterErr;
      }

      let captionsPath: string | null = null;
      if (files.captionsFile) {
        captionsPath = `intro/${timestamp}-captions-${files.captionsFile.name}`;
        const { error: captionsErr } = await supabase.storage
          .from('videos')
          .upload(captionsPath, files.captionsFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: files.captionsFile.type || 'text/vtt',
          });
        if (captionsErr) throw captionsErr;
      }

      // Deactivate previous active rows
      await supabase.from('site_video').update({ is_active: false }).eq('is_active', true);

      // Insert new active row
      const { data, error: insertErr } = await supabase
        .from('site_video')
        .insert({
          video_path: videoPath,
          poster_path: posterPath,
          captions_path: captionsPath,
          title: files.title ?? null,
          description: files.description ?? null,
          is_active: true,
          created_by: user.id,
        })
        .select('*')
        .single();

      if (insertErr) throw insertErr;
      setVideo(data as SiteVideoRow);
      return data as SiteVideoRow;
    },
    [user]
  );

  return {
    video,
    loading,
    error,
    fetchActive,
    uploadAndActivate,
    publicVideoUrl,
    publicPosterUrl,
    publicCaptionsUrl,
  };
};
