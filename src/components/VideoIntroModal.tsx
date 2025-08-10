
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface VideoIntroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string | null;
  posterUrl?: string | null;
  captionsUrl?: string | null;
  title?: string | null;
}

const VideoIntroModal: React.FC<VideoIntroModalProps> = ({ open, onOpenChange, videoUrl, posterUrl, captionsUrl, title }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      const el = videoRef.current;
      // Try to autoplay muted for better UX
      el.muted = true;
      el.play().catch(() => {
        // Autoplay might be blocked; show controls anyway
      });
    } else if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>{title || 'Introduction Video'}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full overflow-hidden rounded-md">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl || undefined}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
            >
              {captionsUrl && (
                <track kind="captions" srcLang="en" src={captionsUrl} default />
              )}
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No video available</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoIntroModal;
