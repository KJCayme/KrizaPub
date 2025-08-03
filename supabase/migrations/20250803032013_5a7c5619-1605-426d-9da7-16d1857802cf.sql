-- Update migrated tools with null user_id to be owned by the current authenticated user
-- This allows users to delete tools that were migrated without proper user_id values

-- First, let's create a function to help with this update
CREATE OR REPLACE FUNCTION public.assign_tools_to_authenticated_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update tools with null user_id to be owned by the first authenticated user
  -- This is typically the admin/owner of the portfolio
  UPDATE public.tools 
  SET user_id = (
    SELECT id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1
  )
  WHERE user_id IS NULL;
END;
$$;

-- Execute the function to assign migrated tools to the authenticated user
SELECT public.assign_tools_to_authenticated_user();

-- Drop the function after use
DROP FUNCTION public.assign_tools_to_authenticated_user();