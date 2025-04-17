-- Enable RLS on the roles table if not already enabled
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating them
DROP POLICY IF EXISTS "Allow service role to read roles" ON public.roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
DROP POLICY IF EXISTS "Allow service role to create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow service role to read profiles" ON public.profiles;

-- Policy to allow service role to read roles
CREATE POLICY "Allow service role to read roles"
ON public.roles
FOR SELECT
TO service_role
USING (true);

-- Policy to allow authenticated users to read roles
CREATE POLICY "Allow authenticated users to read roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow service role to create profiles
CREATE POLICY "Allow service role to create profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy to allow service role to read profiles
CREATE POLICY "Allow service role to read profiles"
ON public.profiles
FOR SELECT
TO service_role
USING (true);

-- Restore the original trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  meta_role_id UUID;
  default_role_id UUID;
  debug_info JSONB;
BEGIN
  -- Store debug information
  debug_info := jsonb_build_object(
    'raw_metadata', NEW.raw_user_meta_data,
    'role_id_from_meta', NEW.raw_user_meta_data->>'role_id',
    'user_id', NEW.id
  );

  -- Log the debug information
  RAISE NOTICE 'handle_new_user debug info: %', debug_info;

  -- Get default role_id first
  SELECT id INTO default_role_id FROM roles WHERE name = 'User' LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Default User role not found in roles table';
  END IF;

  -- Try to get role_id from metadata
  BEGIN
    IF NEW.raw_user_meta_data->>'role_id' IS NOT NULL THEN
      SELECT id INTO meta_role_id 
      FROM roles 
      WHERE id = (NEW.raw_user_meta_data->>'role_id')::uuid 
      LIMIT 1;
      
      IF NOT FOUND THEN
        RAISE NOTICE 'Invalid role_id in metadata: %, falling back to default role', NEW.raw_user_meta_data->>'role_id';
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error processing role_id from metadata: %, falling back to default role', SQLERRM;
  END;

  -- Insert the profile with proper error handling
  BEGIN
    INSERT INTO public.profiles (user_id, first_name, last_name, role_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'FirstName'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'LastName'),
      COALESCE(meta_role_id, default_role_id)
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create profile: % (User ID: %)', SQLERRM, NEW.id;
  END;

  RETURN NEW;
END;
$function$