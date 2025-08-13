-- Update the status constraint to allow all valid status values
ALTER TABLE public.contact_submissions 
DROP CONSTRAINT IF EXISTS contact_submissions_status_check;

-- Add the corrected constraint that allows all status values used in the application
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT contact_submissions_status_check 
CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed'));