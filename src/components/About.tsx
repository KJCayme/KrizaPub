import React, { useState, useEffect, useRef } from 'react';
import { Award, Clock, Heart, Target, ChevronLeft, ChevronRight, MapPin, GraduationCap, Coffee, Users, Music, Camera, Book, Plane, Edit, Download, PlayCircle } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useAboutCarousel } from '../hooks/useAboutCarousel';
import { useAboutInfo } from '../hooks/useAboutInfo';
import { useAboutHobbies } from '../hooks/useAboutHobbies';
import { useAboutTtd } from '../hooks/useAboutTtd';
import { useAboutHighlights } from '../hooks/useAboutHighlights';
import { useAuth } from '../hooks/useAuth';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Button } from './ui/button';
import EditImagesForm from './EditImagesForm';
import EditAboutInfoForm from './EditAboutInfoForm';
import EditHobbiesForm from './EditHobbiesForm';
import EditThingsToDoForm from './EditThingsToDoForm';
import EditHighlightsForm from './EditHighlightsForm';
import DynamicIcon from './DynamicIcon';
import { useProfile } from '../hooks/useProfile';
import { getResumeSignedDownloadUrl } from '@/utils/resumeDownload';

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showEditImages, setShowEditImages] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditHobbies, setShowEditHobbies] = useState(false);
  const [showEditThingsToDo, setShowEditThingsToDo] = useState(false);
  const [showEditHighlights, setShowEditHighlights] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { profile } = useProfile();

  // Use intersection observer for one-time animations
  const { ref: aboutRef, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });

  const { data: carouselImages = [], refetch: refetchImages } = useAboutCarousel();
  const { data: aboutInfo } = useAboutInfo();
  const { data: hobbiesData = [], refetch: refetchHobbies } = useAboutHobbies();
  const { data: thingsToDoData = [], refetch: refetchThingsToDo } = useAboutTtd();
  const { data: highlightsData = [] } = useAboutHighlights();

  // Fallback images if no carousel images are found
  const fallbackImages = [
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1472099645785-5658abf4ff4e',
    'photo-1438761681033-6461ffad8d80',
    'photo-1494790108755-2616b332e234',
    'photo-1560250097-0b93528c311a'
  ];

  const displayImages = carouselImages.length > 0 
    ? carouselImages.map(img => img.image_url)
    : fallbackImages.map(id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`);

  // Use database highlights data with dynamic icons
  const highlights = highlightsData.length > 0 ? highlightsData.map(highlight => ({
    icon: <DynamicIcon iconName={highlight.icon || 'Award'} className="w-6 h-6" />,
    title: highlight.title || 'Untitled',
    description: highlight.description || 'No description'
  })) : [];

  // Use database hobbies data with dynamic icons
  const hobbies = hobbiesData.length > 0 ? hobbiesData.map(hobby => ({
    icon: <DynamicIcon iconName={hobby.icon || 'Music'} className="w-6 h-6" />,
    label: hobby.title || 'Untitled',
    value: hobby.description || 'No description'
  })) : [];

  // Use database things to do data - NO FALLBACK, only from database
  const thingsIWantToDo = thingsToDoData.map(item => ({
    icon: item.icon || "🌍",
    title: item.title,
    description: item.description
  }));

  // Get about info paragraphs - ONLY from database, no fallback
  const aboutParagraphs = aboutInfo?.info 
    ? aboutInfo.info.split(' - ').filter(p => p.trim())
    : [];

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const imageWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * imageWidth,
        behavior: 'smooth'
      });
    }
    setCurrentImageIndex(index);
  };

  // Automatic image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % displayImages.length;
      scrollToImage(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, displayImages.length]);

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % displayImages.length;
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + displayImages.length) % displayImages.length;
    scrollToImage(prevIndex);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleEditImagesUpdate = () => {
    refetchImages();
  };

  const handleHobbiesUpdate = () => {
    refetchHobbies();
  };

  const handleThingsToDoUpdate = () => {
    refetchThingsToDo();
  };

  return (
    <>
      <section ref={aboutRef} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left side - Content with fade-in animation */}
            <div className={`transition-all duration-1000 ${
              hasIntersected ? 'animate-[aboutContentFadeIn_1.2s_ease-out_forwards]' : 'opacity-0 -translate-y-8'
            }`}>
              {/* Title row with action buttons and edit button */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Action buttons - leftmost position */}
                  <div className="flex items-center gap-3 order-1 sm:order-1">
                    {profile?.resume_url && (
                      <Button
                        onClick={async () => {
                          const signed = await getResumeSignedDownloadUrl(
                            profile.resume_url as string,
                            profile.resume_filename || 'CV.pdf'
                          );
                          if (signed) {
                            window.location.href = signed;
                          } else {
                            window.open(profile.resume_url as string, '_blank');
                          }
                        }}
                        aria-label="Download CV"
                        title="Download CV"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download CV</span>
                      </Button>
                    )}
                    <Button variant="secondary" aria-label="Video Introduction" title="Video Introduction" size="sm">
                      <PlayCircle className="w-4 h-4" />
                      <span>Video Introduction</span>
                    </Button>
                  </div>
                  
                  {/* Title and edit button */}
                  <div className="flex items-center gap-4 order-2 sm:order-2">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                      About Me
                    </h2>
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                        onClick={() => setShowEditInfo(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Info
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {aboutParagraphs.length > 0 ? (
                aboutParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  No about information available. {user ? "Click 'Edit Info' to add content." : ""}
                </p>
              )}

              {/* Highlights Grid - Hide "Highlights" text when user is not signed in */}
              {(user || highlights.length > 0) && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    {user && <h3 className="text-xl font-bold text-slate-800">Highlights</h3>}
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                        onClick={() => setShowEditHighlights(true)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {highlights.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6">
                      {highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                            {highlight.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-1">
                              {highlight.title}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {highlight.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : user ? (
                    <p className="text-slate-600 mb-6">
                      No highlights available. Click 'Edit' to add highlights.
                    </p>
                  ) : null}
                </>
              )}
            </div>

            {/* Right side - Side-scrolling Image Carousel with slide-in animation */}
            <div className={`relative transition-all duration-1000 delay-300 ${
              hasIntersected ? 'animate-[aboutImageSlideIn_1.2s_ease-out_forwards]' : 'opacity-0 translate-x-8'
            }`}>
              <div className="relative z-10">
                <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center overflow-hidden shadow-2xl relative">
                  {/* Scrollable container with scroll snap */}
                  <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide h-full w-full snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={(e) => {
                      const target = e.target as HTMLDivElement;
                      const imageWidth = target.clientWidth;
                      const newIndex = Math.round(target.scrollLeft / imageWidth);
                      setCurrentImageIndex(newIndex);
                    }}
                  >
                    {displayImages.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`About me - ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0 select-none snap-start"
                        onContextMenu={handleContextMenu}
                        draggable={false}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToImage(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-full h-full rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 -z-10"></div>
              
              {/* Edit Images Button */}
              {user && (
                <div className="mt-4 text-center">
                  <Button
                    onClick={() => setShowEditImages(true)}
                    variant="outline"
                    size="sm"
                    className="text-slate-600 hover:text-slate-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Images
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Full-width section for Hobbies and Things I Want to Do with staggered animation */}
          <div className={`w-full transition-all duration-1000 delay-600 ${
            hasIntersected ? 'animate-[aboutSectionsFadeIn_1.2s_ease-out_forwards]' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hobbies Section */}
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-800">Hobbies & Interests</h3>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      onClick={() => setShowEditHobbies(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {hobbies.length > 0 ? (
                  <div className={`space-y-4 ${hobbies.length >= 5 ? 'grid grid-cols-2 gap-4' : ''}`}>
                    {hobbies.map((hobby, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-blue-600">
                          {hobby.icon}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">{hobby.label}</p>
                          <p className="text-sm text-slate-800 font-semibold">{hobby.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">
                    No hobbies available. {user ? "Click 'Edit' to add hobbies." : ""}
                  </p>
                )}
              </div>

              {/* Things I Want to Do Section */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-800">Things I Want to Do</h3>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      onClick={() => setShowEditThingsToDo(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {thingsIWantToDo.length > 0 ? (
                  <div className="space-y-4">
                    {thingsIWantToDo.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="text-2xl flex-shrink-0">{item.icon}</div>
                        <div>
                          <p className="text-slate-800 font-semibold text-sm">{item.title}</p>
                          <p className="text-slate-700 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">
                    No items available. {user ? "Click 'Edit' to add items." : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Me one-time animation keyframes */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes aboutContentFadeIn {
              0% { 
                opacity: 0;
                transform: translateY(-32px);
              }
              100% { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes aboutImageSlideIn {
              0% { 
                opacity: 0;
                transform: translateX(32px);
              }
              100% { 
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes aboutSectionsFadeIn {
              0% { 
                opacity: 0;
                transform: translateY(32px);
              }
              100% { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `
        }} />
      </section>

      <EditImagesForm
        isOpen={showEditImages}
        onClose={() => setShowEditImages(false)}
        images={carouselImages}
        onUpdate={handleEditImagesUpdate}
      />
      
      <EditAboutInfoForm
        isOpen={showEditInfo}
        onClose={() => setShowEditInfo(false)}
      />
      
      <EditHobbiesForm
        isOpen={showEditHobbies}
        onClose={() => setShowEditHobbies(false)}
        onUpdate={handleHobbiesUpdate}
      />
      
      <EditThingsToDoForm
        isOpen={showEditThingsToDo}
        onClose={() => setShowEditThingsToDo(false)}
        onUpdate={handleThingsToDoUpdate}
      />
      
      <EditHighlightsForm
        isOpen={showEditHighlights}
        onClose={() => setShowEditHighlights(false)}
      />
    </>
  );
};

export default About;
