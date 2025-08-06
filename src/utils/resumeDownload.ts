import { supabase } from "@/integrations/supabase/client";

// Generate a short-lived signed URL that forces file download
export const getResumeSignedDownloadUrl = async (
  resumeUrl: string,
  filename: string = "resume.pdf",
  expiresInSeconds: number = 60
): Promise<string | null> => {
  try {
    if (!resumeUrl) return null;

    // Expecting URLs like: /storage/v1/object/public/portfolio/resumes/<file>
    const prefix = "/storage/v1/object/public/portfolio/";
    let filePath: string | null = null;

    try {
      const u = new URL(resumeUrl);
      if (u.pathname.startsWith(prefix)) {
        filePath = u.pathname.slice(prefix.length);
      }
    } catch {
      // Fallback parsing if resumeUrl is not a valid absolute URL in this environment
      const idx = resumeUrl.indexOf(prefix);
      if (idx !== -1) {
        filePath = resumeUrl.slice(idx + prefix.length);
      }
    }

    if (!filePath) return null;

    const { data, error } = await supabase.storage
      .from("portfolio")
      .createSignedUrl(filePath, expiresInSeconds, { download: filename });

    if (error) {
      console.error("Error creating signed download URL:", error);
      return null;
    }

    return data?.signedUrl ?? null;
  } catch (err) {
    console.error("Failed to build signed resume URL:", err);
    return null;
  }
};
