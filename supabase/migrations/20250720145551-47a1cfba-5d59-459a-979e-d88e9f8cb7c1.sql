
-- Insert all static skills from the Skills component into the skills_main table
INSERT INTO public.skills_main (skill_name, description, icon, color, badge) VALUES
('Executive Admin Assistant', 'Comprehensive administrative support for executives and businesses', 'Calendar', 'from-blue-500 to-cyan-500', NULL),
('Social Media Manager', 'Strategic social media management to boost your online presence', 'Users', 'from-purple-500 to-pink-500', NULL),
('Project Manager', 'End-to-end project coordination and management', 'TrendingUp', 'from-green-500 to-emerald-500', NULL),
('Graphic Designer', 'Creative visual solutions for your brand and marketing needs', 'Palette', 'from-orange-500 to-red-500', NULL),
('Copywriting', 'Compelling content creation that drives engagement and conversions', 'PenTool', 'from-teal-500 to-cyan-500', NULL),
('Web Development', 'Modern web development solutions for your business', 'Code', 'from-indigo-500 to-blue-500', 'Soon!'),
('AI Automation', 'Intelligent automation solutions to streamline your workflow', 'Bot', 'from-violet-500 to-purple-500', 'Soon!')
ON CONFLICT (skill_name) DO NOTHING;

-- Update the skills_expertise table with the detailed services for each skill
UPDATE public.skills_expertise 
SET details = ARRAY[
  'Calendar Management & Scheduling',
  'Email Management & Organization', 
  'Travel Planning & Coordination',
  'Document Preparation & Management',
  'Meeting Preparation & Follow-up'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'Executive Admin Assistant');

UPDATE public.skills_expertise 
SET details = ARRAY[
  'Content Strategy & Planning',
  'Social Media Scheduling', 
  'Community Management',
  'Analytics & Reporting',
  'Brand Voice Development',
  'Engagement Optimization'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'Social Media Manager');

UPDATE public.skills_expertise 
SET details = ARRAY[
  'Project Planning & Timeline Creation',
  'Team Coordination & Communication',
  'Resource Management',
  'Progress Tracking & Reporting',
  'Risk Assessment & Mitigation',
  'Stakeholder Management'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'Project Manager');

UPDATE public.skills_expertise 
SET details = ARRAY[
  'Logo & Brand Identity Design',
  'Marketing Material Creation',
  'Social Media Graphics',
  'Presentation Design',
  'Print Design',
  'Brand Guidelines Development'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'Graphic Designer');

UPDATE public.skills_expertise 
SET details = ARRAY[
  'Website Copy & Content',
  'Marketing Materials',
  'Blog Posts & Articles',
  'Social Media Content',
  'Email Campaigns',
  'Product Descriptions'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'Copywriting');

UPDATE public.skills_expertise 
SET details = ARRAY[
  'Responsive Website Development',
  'E-commerce Solutions',
  'Web Application Development',
  'UI/UX Implementation',
  'Performance Optimization',
  'Maintenance & Support'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'Web Development');

UPDATE public.skills_expertise 
SET details = ARRAY[
  'Workflow Automation',
  'AI-Powered Content Generation',
  'Process Optimization',
  'Integration Solutions',
  'Data Analysis & Insights',
  'Custom AI Tools | AI Agents'
]
WHERE skill_id = (SELECT id FROM public.skills_main WHERE skill_name = 'AI Automation');

-- Add a hidden column to skills_main table to support hiding skills
ALTER TABLE public.skills_main ADD COLUMN IF NOT EXISTS hidden boolean DEFAULT false;
