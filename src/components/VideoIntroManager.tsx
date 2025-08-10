
import React, { useState } from 'react';
import { useSiteVideo } from '@/hooks/useSiteVideo';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VideoIntroManager: React.FC = () => {
  const { video, loading, uploadAndActivate, publicVideoUrl, publicPosterUrl, publicCaptionsUrl } = useSiteVideo();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [captionsFile, setCaptionsFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error('Please choose a video file to upload.');
      return;
    }
    const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
    if (videoFile.size > MAX_BYTES) {
      toast.error('Video must be 50 MB or smaller.');
      return;
    }
    try {
      setSubmitting(true);
      await uploadAndActivate({
        videoFile,
        posterFile: posterFile || undefined,
        captionsFile: captionsFile || undefined,
        title: title || undefined,
        description: description || undefined,
      });
      toast.success('Video uploaded and applied successfully.');
      setVideoFile(null);
      setPosterFile(null);
      setCaptionsFile(null);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload video');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-semibold text-config-text-primary mb-4">Video Introduction</h3>
      <p className="text-config-text-secondary mb-6">Upload a short intro video stored in Supabase and shown in a modal player on your homepage.</p>

      {/* Top div is full width by default. Below is a responsive two-column layout */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Video intro preview */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Current Video Preview</div>
            {!loading && (publicVideoUrl ? (
              <div>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-[hsl(var(--border))]">
                  <video src={publicVideoUrl} poster={publicPosterUrl || undefined} controls preload="metadata" className="w-full h-full object-contain bg-black" />
                </div>
                {publicCaptionsUrl && (
                  <div className="text-xs text-muted-foreground mt-2">Captions: enabled</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No video configured yet.</div>
            ))}
          </div>

          {/* Right: Video file, Captions, Poster, Title */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Video file <span className="text-xs text-muted-foreground ml-1">(Max 50 MB)</span>
              </Label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Captions .vtt (optional)</Label>
              <input
                type="file"
                accept=".vtt,text/vtt"
                onChange={(e) => setCaptionsFile(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Poster image (optional)</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Introduction Video"
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Below the two-column layout: Description */}
        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Uploading...' : (video ? 'Replace Video' : 'Upload Video')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoIntroManager;
