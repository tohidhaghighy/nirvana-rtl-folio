-- Add worker role to existing profiles (assuming role column exists)
-- First check if 'worker' is already in the role constraint, if not we'll add it

-- Create time_logs table for tracking worker hours
CREATE TABLE public.time_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID NOT NULL,
  date DATE NOT NULL,
  hours_worked DECIMAL(4,2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(worker_id, date)
);

-- Create day_off_requests table for managing time off
CREATE TABLE public.day_off_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID NOT NULL,
  request_date DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_off_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for time_logs
CREATE POLICY "Workers can view their own time logs" 
ON public.time_logs 
FOR SELECT 
USING (auth.uid() = worker_id OR is_current_user_admin());

CREATE POLICY "Workers can insert their own time logs" 
ON public.time_logs 
FOR INSERT 
WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Workers can update their own time logs" 
ON public.time_logs 
FOR UPDATE 
USING (auth.uid() = worker_id OR is_current_user_admin());

CREATE POLICY "Admins can delete time logs" 
ON public.time_logs 
FOR DELETE 
USING (is_current_user_admin());

-- Create policies for day_off_requests
CREATE POLICY "Workers can view their own day off requests" 
ON public.day_off_requests 
FOR SELECT 
USING (auth.uid() = worker_id OR is_current_user_admin());

CREATE POLICY "Workers can create their own day off requests" 
ON public.day_off_requests 
FOR INSERT 
WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Workers can update their pending requests" 
ON public.day_off_requests 
FOR UPDATE 
USING (auth.uid() = worker_id AND status = 'pending' OR is_current_user_admin());

CREATE POLICY "Admins can delete day off requests" 
ON public.day_off_requests 
FOR DELETE 
USING (is_current_user_admin());

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_time_logs_updated_at
BEFORE UPDATE ON public.time_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_day_off_requests_updated_at
BEFORE UPDATE ON public.day_off_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_time_logs_worker_date ON public.time_logs(worker_id, date);
CREATE INDEX idx_day_off_requests_worker_status ON public.day_off_requests(worker_id, status);
CREATE INDEX idx_day_off_requests_status ON public.day_off_requests(status);