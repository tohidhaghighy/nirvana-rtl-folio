-- Add policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS admin_profile
    WHERE admin_profile.user_id = auth.uid() 
    AND admin_profile.role = 'admin'
  )
);