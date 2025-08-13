-- Add missing phone column to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN phone text;