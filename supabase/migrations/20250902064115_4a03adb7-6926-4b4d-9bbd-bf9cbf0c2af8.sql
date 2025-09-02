-- Add missing role types if not already present
DO $$ 
BEGIN
    -- Check if role column allows the new values, if not we may need to alter
    -- First, let's add a policy for admins to update other users' profiles
END $$;

-- Create policy to allow admins to update any user's profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (is_current_user_admin());

-- Ensure role column accepts all the required values
-- Update the default constraint to include all role types
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'super_admin', 'client', 'worker'));