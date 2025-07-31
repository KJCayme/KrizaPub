-- Create tools table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Create policies for tools access
CREATE POLICY "Anyone can view tools" 
ON public.tools 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert tools" 
ON public.tools 
FOR INSERT 
WITH CHECK ((auth.role() = 'authenticated'::text) AND (auth.uid() = user_id));

CREATE POLICY "Users can update their own tools" 
ON public.tools 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tools" 
ON public.tools 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the existing tools data
INSERT INTO public.tools (name, category, icon, color, user_id) VALUES
('Notion', 'Productivity', 'https://www.notion.so/images/favicon.ico', 'bg-white', NULL),
('Canva', 'Design', 'https://static.canva.com/web/images/favicon.ico', 'bg-purple-100', NULL),
('Figma', 'Design', 'https://static.figma.com/app/icon/1/favicon.ico', 'bg-orange-100', NULL),
('Adobe Creative Suite', 'Design', 'https://www.adobe.com/favicon.ico', 'bg-red-100', NULL),
('Slack', 'Communication', 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', 'bg-purple-100', NULL),
('Trello', 'Project Management', 'https://trello.com/favicon.ico', 'bg-blue-100', NULL),
('Asana', 'Project Management', 'https://asana.com/favicon.ico', 'bg-orange-100', NULL),
('Google Workspace', 'Productivity', 'https://workspace.google.com/favicon.ico', 'bg-blue-100', NULL),
('Hootsuite', 'Social Media', 'https://hootsuite.com/favicon.ico', 'bg-yellow-100', NULL),
('Buffer', 'Social Media', 'https://buffer.com/favicon.ico', 'bg-blue-100', NULL),
('Later', 'Social Media', 'https://later.com/favicon.ico', 'bg-green-100', NULL),
('Loom', 'Video', 'https://www.loom.com/favicon.ico', 'bg-purple-100', NULL),
('Zoom', 'Communication', 'https://zoom.us/favicon.ico', 'bg-blue-100', NULL),
('Microsoft Office', 'Productivity', 'https://res.cdn.office.net/assets/mail/file-icon/png/generic_16x16.png', 'bg-blue-100', NULL),
('Grammarly', 'Writing', 'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/favicon-32x32.png', 'bg-green-100', NULL),
('Calendly', 'Scheduling', 'https://calendly.com/favicon.ico', 'bg-blue-100', NULL);