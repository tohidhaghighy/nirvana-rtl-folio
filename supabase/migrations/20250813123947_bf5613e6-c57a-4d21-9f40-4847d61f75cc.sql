-- Add email column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email TEXT;

-- Update existing profiles with their email from auth.users
-- We'll do this through the trigger update, but first let's update the trigger

-- Update the handle_new_user function to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    CASE 
      -- First user becomes admin, others are clients
      WHEN (SELECT COUNT(*) FROM auth.users) = 1 THEN 'admin'
      ELSE 'client'
    END
  );
  RETURN NEW;
END;
$$;

-- Update existing profiles with emails from auth.users using a function
CREATE OR REPLACE FUNCTION public.sync_profile_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET email = auth.users.email
  FROM auth.users 
  WHERE profiles.user_id = auth.users.id 
  AND profiles.email IS NULL;
END;
$$;

-- Execute the sync function to update existing profiles
SELECT public.sync_profile_emails();