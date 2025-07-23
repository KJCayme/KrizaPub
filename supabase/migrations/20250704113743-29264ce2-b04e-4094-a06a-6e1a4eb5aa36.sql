
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  months TEXT NOT NULL,
  caption TEXT NOT NULL,
  results TEXT NOT NULL,
  skills_used TEXT NOT NULL,
  project_card_image TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT,
  detailed_process TEXT,
  detailed_results TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project carousel images table
CREATE TABLE public.project_carousel_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_carousel_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a portfolio site)
CREATE POLICY "Anyone can view projects" 
  ON public.projects 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view project carousel images" 
  ON public.project_carousel_images 
  FOR SELECT 
  USING (true);

-- Insert the existing portfolio projects into the database
INSERT INTO public.projects (title, months, caption, results, skills_used, project_card_image, category, badge, detailed_process, detailed_results) VALUES
('Executive Calendar Management System', '3 months', 'Streamlined scheduling system for C-level executives with automated conflict resolution and meeting preparation workflows.', 'Reduced scheduling conflicts by 85% and saved 15 hours/week', 'Calendar Management, Executive Support, Process Optimization', 'photo-1486312338219-ce68d2c6f44d', 'admin', NULL, 'Implemented a comprehensive calendar management system starting with stakeholder analysis and workflow mapping. Created automated scheduling algorithms that consider time zones, meeting priorities, and participant availability. Developed conflict resolution protocols and integrated with existing CRM systems.', 'Achieved 85% reduction in scheduling conflicts through automated conflict detection. Saved 15 hours per week in administrative tasks. Increased meeting attendance rates by 40% due to better scheduling optimization. Reduced double-booking incidents to zero over 6-month period.'),

('Multi-Platform Social Media Campaign', '6 months', 'Comprehensive social media strategy and content creation for tech startup, including brand voice development and community engagement.', 'Increased engagement by 300% and gained 5K new followers', 'Content Strategy, Community Management, Brand Development', 'photo-1605810230434-7631ac76ec81', 'social', NULL, 'Conducted comprehensive brand audit and competitor analysis. Developed cohesive content strategy across Instagram, LinkedIn, and Twitter. Created content calendar with mix of educational, promotional, and engagement-focused posts. Implemented community management protocols and engagement strategies.', 'Grew follower base from 1.2K to 6.2K across all platforms. Increased average engagement rate from 2.1% to 8.7%. Generated 150+ qualified leads through social media campaigns. Built active community with 45% monthly engagement rate.'),

('Cross-Department Project Coordination', '4 months', 'Led coordination of product launch involving 5 departments, managing timeline, resources, and stakeholder communication.', 'Delivered 2 weeks ahead of schedule with 100% stakeholder satisfaction', 'Team Coordination, Timeline Management, Stakeholder Communication', 'photo-1461749280684-dccba630e2f6', 'project', NULL, 'Established project governance structure with clear roles and responsibilities. Implemented weekly cross-departmental sync meetings and progress tracking dashboard. Created risk management framework and contingency plans. Facilitated stakeholder alignment through regular communication protocols.', 'Completed product launch 2 weeks ahead of original timeline. Achieved 100% stakeholder satisfaction rating in post-project survey. Reduced inter-departmental communication delays by 60%. Successfully coordinated efforts of 25+ team members across 5 departments.'),

('Brand Identity & Marketing Materials', '2 months', 'Complete visual identity overhaul including logo design, marketing collateral, and social media templates for small business.', 'Increased brand recognition by 200% and improved conversion rates', 'Logo Design, Brand Guidelines, Marketing Materials', 'photo-1488590528505-98d2b5aba04b', 'design', NULL, 'Conducted brand discovery workshops to understand company values and target audience. Created mood boards and design concepts for stakeholder review. Developed comprehensive brand guidelines including color palette, typography, and usage rules. Designed complete marketing collateral suite.', 'Achieved 200% increase in brand recognition through consistent visual identity. Improved website conversion rate by 35% with new design elements. Created 50+ branded marketing materials including brochures, business cards, and digital assets. Reduced design production time by 40% through standardized templates.'),

('Document Management & Process Automation', '2 months', 'Implemented digital filing system and automated report generation, reducing manual work and improving accuracy.', 'Eliminated 20 hours of manual work per week', 'Process Automation, Document Management, Efficiency Optimization', 'photo-1461749280684-dccba630e2f6', 'admin', NULL, 'Audited existing document workflows and identified automation opportunities. Implemented cloud-based document management system with automated filing and retrieval. Created templates and standardized processes for report generation. Trained team members on new systems and workflows.', 'Eliminated 20 hours of manual document processing per week. Reduced document retrieval time from 15 minutes to 30 seconds. Achieved 99.5% accuracy in automated report generation. Improved compliance with document retention policies by 100%.'),

('E-commerce Website Development', '4 months', 'Built a complete e-commerce platform with modern design, responsive layout, and integrated payment processing.', 'Increased online sales by 250% within first quarter', 'React, E-commerce, Payment Integration, Responsive Design', 'photo-1460925895917-afdab827c52f', 'webdev', 'Soon!', 'Designed and developed full-stack e-commerce solution using modern web technologies. Implemented secure payment processing and inventory management. Created responsive design for optimal mobile experience. Integrated analytics and reporting features.', 'Launched fully functional e-commerce platform with 99.9% uptime. Increased online sales by 250% in first quarter. Processed 1000+ orders with zero payment issues. Achieved 4.8/5 customer satisfaction rating.'),

('Smart Content Automation System', '3 months', 'Developed AI-powered content generation and scheduling system that automatically creates and posts social media content.', 'Reduced content creation time by 80% while maintaining quality', 'AI Integration, Content Automation, Workflow Optimization', 'photo-1677442136019-21780ecad995', 'ai', NULL, 'Integrated advanced AI models for content generation and optimization. Developed automated scheduling and posting workflows. Created quality control systems and brand voice consistency checks. Implemented performance tracking and optimization algorithms.', 'Automated 80% of content creation process while maintaining quality standards. Generated 500+ pieces of content monthly. Improved content engagement rates by 45%. Reduced content creation costs by 70%.'),

('Sales Copy & Email Campaign', '2 months', 'Created high-converting sales copy and email sequences that dramatically improved conversion rates and customer engagement.', 'Increased conversion rates by 180% and email open rates by 65%', 'Sales Copy, Email Marketing, Conversion Optimization', 'photo-1581091226825-a6a2a5aee158', 'copywriting', NULL, 'Analyzed target audience psychology and pain points. Created compelling sales copy using proven copywriting frameworks. Developed automated email sequences with personalization. Implemented A/B testing for continuous optimization.', 'Increased email open rates from 18% to 30%. Boosted click-through rates by 85%. Improved sales conversion rate by 180%. Generated additional $75K revenue through optimized copy.');
