-- Update contact_submissions table to work with user system
ALTER TABLE contact_submissions 
ADD COLUMN user_id uuid REFERENCES auth.users(id),
ADD COLUMN admin_notes text;

-- Update contact submissions RLS policies
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Only authenticated users can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Only authenticated users can update contact submissions" ON contact_submissions;

-- New RLS policies for contact submissions
CREATE POLICY "Anyone can submit contact forms" 
ON contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own submissions" 
ON contact_submissions 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IS NULL OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update any submission" 
ON contact_submissions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Update profiles table role default
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'client';

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = $1 
    AND profiles.role = 'admin'
  );
$$;

-- Update the handle_new_user function to set proper role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE 
      -- First user becomes admin, others are clients
      WHEN (SELECT COUNT(*) FROM auth.users) = 1 THEN 'admin'
      ELSE 'client'
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();