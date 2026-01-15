-- Add position column to job_applications table
ALTER TABLE public.job_applications 
ADD COLUMN position text;