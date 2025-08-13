-- Add responses table for admin responses to client tickets
CREATE TABLE public.ticket_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin_response BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for ticket_responses
ALTER TABLE public.ticket_responses ENABLE ROW LEVEL SECURITY;

-- Policies for ticket_responses
-- Users can view responses for their own submissions
CREATE POLICY "Users can view responses to their submissions" 
ON public.ticket_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.contact_submissions 
    WHERE contact_submissions.id = submission_id 
    AND contact_submissions.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admins can insert responses
CREATE POLICY "Admins can create responses" 
ON public.ticket_responses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Users can add responses to their own submissions (for back and forth conversation)
CREATE POLICY "Users can respond to their own submissions" 
ON public.ticket_responses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.contact_submissions 
    WHERE contact_submissions.id = submission_id 
    AND contact_submissions.user_id = auth.uid()
  ) AND 
  is_admin_response = false
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_ticket_responses_updated_at
BEFORE UPDATE ON public.ticket_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for ticket responses
ALTER PUBLICATION supabase_realtime ADD TABLE ticket_responses;