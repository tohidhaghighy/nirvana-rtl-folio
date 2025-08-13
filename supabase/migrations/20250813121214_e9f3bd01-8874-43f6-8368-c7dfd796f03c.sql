-- Fix the role constraint to allow all valid roles including 'client'
ALTER TABLE public.profiles 
DROP CONSTRAINT profiles_role_check;

-- Add the corrected constraint that allows admin, super_admin, and client roles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text, 'client'::text]));