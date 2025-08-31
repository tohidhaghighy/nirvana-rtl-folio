-- Add foreign key constraints to link tables properly
ALTER TABLE public.time_logs 
ADD CONSTRAINT fk_time_logs_worker 
FOREIGN KEY (worker_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.day_off_requests 
ADD CONSTRAINT fk_day_off_requests_worker 
FOREIGN KEY (worker_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.day_off_requests 
ADD CONSTRAINT fk_day_off_requests_reviewer 
FOREIGN KEY (reviewed_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL;