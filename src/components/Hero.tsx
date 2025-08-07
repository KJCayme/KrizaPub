
import React, { useState, useEffect } from 'react';
import { handleBookCall } from '../utils/bookCall';
import { useProfile } from '../hooks/useProfile';
import { useHeroRoles } from '../hooks/useHeroRoles';
import EditProfileForm from './EditProfileForm';
import ProfileImageUpload from './ProfileImageUpload';
import { Download } from 'lucide-react';
import { getResumeSignedDownloadUrl } from '../utils/resumeDownload';

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showAnimations, setShowAnimations] = useState(false);
  const { profile, loading: profileLoading, fetchProfile } = useProfile();
  const { roles, loading: rolesLoading, refetchRoles } = useHeroRoles();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDataRefresh = async () => {
    // Refetch both profile and roles data
    await Promise.all([
      fetchProfile(),
      refetchRoles()
    ]);
  };
  
  const handleResumeDownload = async () => {
    if (!profile?.resume_url) return;
    const signed = await getResumeSignedDownloadUrl(
      profile.resume_url,
      profile.resume_filename || 'CV.pdf'
    );
    if (signed) {
      window.location.href = signed;
    } else {
      // Fallback: open original URL (may open in new tab)
      window.open(profile.resume_url, '_blank');
    }
  };
  useEffect(() => {
    if (!profileLoading && !rolesLoading) {
      const timer = setTimeout(() => {
        setShowAnimations(true);
      }, 500); // Small delay to ensure smooth start
      
      return () => clearTimeout(timer);
    }
  }, [profileLoading, rolesLoading]);

  useEffect(() => {
    if (roles.length === 0) return;

    const handleTyping = () => {
      const currentRoleText = roles[currentRole];
      
      if (isDeleting) {
        setDisplayText(currentRoleText.substring(0, displayText.length - 1));
        setTypingSpeed(75);
      } else {
        setDisplayText(currentRoleText.substring(0, displayText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === currentRoleText) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRole, typingSpeed, roles]);

  if (profileLoading || rolesLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-start))] via-[hsl(var(--bg-mid))] to-[hsl(var(--bg-end))] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  const displayName = profile?.name || 'Kenneth John Cayme';
  const displayCaption = profile?.caption || 'Empowering businesses through exceptional virtual assistance, strategic social media management, seamless administrative support, creative design, and utilizing Artificial Intelligence.';

  return (
    <section className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-start))] via-[hsl(var(--bg-mid))] to-[hsl(var(--bg-end))] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[hsl(var(--blob-1))] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--blob-2))] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[hsl(var(--blob-3))] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Buttons positioned above the name */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <ProfileImageUpload onImageUploaded={handleDataRefresh} />
          <EditProfileForm onProfileUpdated={handleDataRefresh} />
        </div>

        <div className="mt-8 mb-8 flex items-center justify-center gap-8">
          {/* Main profile picture with new triple bounce animation from top-right */}
          <div className={`w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-1000 ${
            showAnimations ? 'animate-[heroImageTripleBounce_1.8s_ease-out_forwards]' : 'opacity-0 -translate-y-32 translate-x-32'
          }`}>
            {profile?.profile_image ? (
              <img 
                src={profile.profile_image} 
                alt={displayName}
                className="w-full h-full object-cover select-none"
                onContextMenu={handleContextMenu}
                draggable={false}
                key={profile.profile_image}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white/70">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                    👋
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Name with decoding animation and Download CV icon - hide icon on mobile/tablet */}
        <div className={`mb-6 flex items-center justify-center gap-3 transition-all duration-1000 ${
          showAnimations ? 'animate-[heroNameDecode_1.5s_ease-out_forwards]' : 'opacity-0'
        }`}>
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            {displayName}
          </h1>
          {profile?.resume_url && (
            <button
              type="button"
              onClick={handleResumeDownload}
              title="Download CV"
              aria-label="Download CV"
              className="hidden lg:block p-2 rounded-full text-blue-200/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Roles with slide-in from right animation */}
        <div className="h-16 flex items-center justify-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-semibold text-blue-200 min-h-[1.2em] flex items-center transition-all duration-1000 delay-300 ${
            showAnimations ? 'animate-[heroRoleSlideIn_0.8s_ease-out_forwards]' : 'opacity-0 translate-x-32'
          }`}>
            <span className="typewriter-text">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </h2>
        </div>

        {/* CV Fallback */}
        <div className={`mb-8 transition-all duration-1000 delay-700 ${
          showAnimations ? 'animate-[heroCaptionSlideIn_0.8s_ease-out_forwards]' : 'opacity-0 -translate-x-32'
        }`}>
          {!profile?.resume_url && (
            <div className="text-slate-400 text-sm">
              No CV Available
            </div>
          )}
        </div>

        {/* Caption with slide-in from left animation */}
        <p className={`text-xl text-slate-300 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-500 ${
          showAnimations ? 'animate-[heroCaptionSlideIn_0.8s_ease-out_forwards]' : 'opacity-0 -translate-x-32'
        }`}>
          {displayCaption}
        </p>
      </div>

      {/* Updated one-time animation keyframes with new triple bounce */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes heroImageTripleBounce {
            0% { 
              opacity: 0;
              transform: translateY(-300px) translateX(300px);
            }
            30% { 
              opacity: 1;
              transform: translateY(60px) translateX(-20px);
            }
            45% { 
              transform: translateY(-30px) translateX(10px);
            }
            60% { 
              transform: translateY(20px) translateX(-5px);
            }
            75% { 
              transform: translateY(-10px) translateX(2px);
            }
            90% { 
              transform: translateY(5px) translateX(-1px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0) translateX(0);
            }
          }
          
          @keyframes heroNameDecode {
            0% { 
              opacity: 0;
              filter: blur(10px);
              transform: scale(0.8);
            }
            50% { 
              opacity: 0.7;
              filter: blur(5px);
              transform: scale(1.05);
            }
            100% { 
              opacity: 1;
              filter: blur(0px);
              transform: scale(1);
            }
          }
          
          @keyframes heroRoleSlideIn {
            0% { 
              opacity: 0;
              transform: translateX(128px);
            }
            100% { 
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes heroCaptionSlideIn {
            0% { 
              opacity: 0;
              transform: translateX(-128px);
            }
            100% { 
              opacity: 1;
              transform: translateX(0);
            }
          }
        `
      }} />
    </section>
  );
};

export default Hero;
