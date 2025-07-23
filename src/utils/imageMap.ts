// Image mapping for local assets
export const projectCardImages = {
  'photo-1486312338219-ce68d2c6f44d': '/images/projects/cards/macbook-pro.jpg',
  'photo-1461749280684-dccba630e2f6': '/images/projects/cards/java-programming.jpg',
  'photo-1488590528505-98d2b5aba04b': '/images/projects/cards/laptop-computer.jpg',
  'photo-1507003211169-0a1dd7228f2d': '/images/projects/cards/person-working.jpg',
  'photo-1460925895917-afdab827c52f': '/images/projects/cards/glass-table-laptop.jpg',
  'photo-1454165804606-c3d57bc86b40': '/images/projects/cards/project-planning.jpg',
} as const;

export const carouselImages = {
  'photo-1551836022-deb4988cc6c0': '/images/projects/carousel/office-workspace.jpg',
  'photo-1586281380349-632531db7ed4': '/images/projects/carousel/digital-calendar.jpg',
  'photo-1611224923853-80b023f02d71': '/images/projects/carousel/social-media-icons.jpg',
  'photo-1563986768609-322da13575f3': '/images/projects/carousel/social-media-marketing.jpg',
  'photo-1677442136019-21780ecad995': '/images/projects/carousel/ai-machine-learning.jpg',
} as const;

export const certificateImages = {
  'photo-1487058792275-0ad4aaf24ca7': '/images/certificates/web-code.jpg',
} as const;

export const getProjectCardImage = (unsplashId: string): string => {
  return projectCardImages[unsplashId as keyof typeof projectCardImages] || 
         `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=400&q=80`;
};

export const getCarouselImage = (unsplashId: string): string => {
  return carouselImages[unsplashId as keyof typeof carouselImages] || 
         `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=1000&q=80`;
};

export const getCertificateImage = (unsplashId: string): string => {
  const imageId = unsplashId.replace('https://images.unsplash.com/', '').split('?')[0];
  return certificateImages[imageId as keyof typeof certificateImages] || unsplashId;
};