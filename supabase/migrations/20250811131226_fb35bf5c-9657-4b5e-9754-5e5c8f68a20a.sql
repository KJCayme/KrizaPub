
-- Add problem and solution columns to projects table
ALTER TABLE projects 
ADD COLUMN problem TEXT,
ADD COLUMN solution TEXT;
