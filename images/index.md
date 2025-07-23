# Images Directory Structure

This directory contains all local images organized by usage:

## Directory Structure

```
images/
├── projects/
│   ├── cards/          # Images used in project cards (400x300 recommended)
│   └── carousel/       # Images used in project carousels (1000x600 recommended)
├── certificates/       # Certificate related images (800x600 recommended)
├── about/             # About section images (600x400 recommended)
└── index.md           # This file
```

## Image Management

- All images are managed through `src/utils/imageMap.ts`
- Local images take priority over Unsplash URLs
- Fallback to Unsplash if local image not found
- Use the utility functions to get image paths:
  - `getProjectCardImage(unsplashId)` for project cards
  - `getCarouselImage(unsplashId)` for carousels
  - `getCertificateImage(unsplashId)` for certificates

## Adding New Images

1. Add image to appropriate folder
2. Update the mapping in `src/utils/imageMap.ts`
3. Use the utility function in components

## Current Images

### Project Cards
- macbook-pro.jpg (photo-1486312338219-ce68d2c6f44d)
- java-programming.jpg (photo-1461749280684-dccba630e2f6)
- laptop-computer.jpg (photo-1488590528505-98d2b5aba04b)
- person-working.jpg (photo-1507003211169-0a1dd7228f2d)
- glass-table-laptop.jpg (photo-1460925895917-afdab827c52f)
- project-planning.jpg (photo-1454165804606-c3d57bc86b40)

### Carousel Images
- office-workspace.jpg (photo-1551836022-deb4988cc6c0)
- digital-calendar.jpg (photo-1586281380349-632531db7ed4)
- social-media-icons.jpg (photo-1611224923853-80b023f02d71)
- social-media-marketing.jpg (photo-1563986768609-322da13575f3)
- ai-machine-learning.jpg (photo-1677442136019-21780ecad995)

### Certificates
- web-code.jpg (photo-1487058792275-0ad4aaf24ca7)