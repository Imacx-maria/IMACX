-- Fix permissions for all relevant tables
-- Run this in the Supabase SQL Editor

-- Enable RLS on tables if not already enabled
ALTER TABLE "folhas_obras" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "folhas_obra" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users_with_profiles" ENABLE ROW LEVEL SECURITY;

-- Grant permissions to the authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON "folhas_obras" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "folhas_obra" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "items" TO authenticated;
GRANT SELECT ON "profiles" TO authenticated;
GRANT SELECT ON "roles" TO authenticated;
GRANT SELECT ON "users_with_profiles" TO authenticated;

-- Create permissive policies for authenticated users
-- folhas_obras table
DROP POLICY IF EXISTS "Allow authenticated access to folhas_obras" ON "folhas_obras";
CREATE POLICY "Allow authenticated access to folhas_obras" 
ON "folhas_obras"
FOR ALL 
TO authenticated
USING (true);

-- folhas_obra table
DROP POLICY IF EXISTS "Allow authenticated access to folhas_obra" ON "folhas_obra";
CREATE POLICY "Allow authenticated access to folhas_obra" 
ON "folhas_obra"
FOR ALL 
TO authenticated
USING (true);

-- items table
DROP POLICY IF EXISTS "Allow authenticated access to items" ON "items";
CREATE POLICY "Allow authenticated access to items" 
ON "items"
FOR ALL 
TO authenticated
USING (true);

-- Ensure service role can access everything (for admin operations)
GRANT ALL ON "folhas_obras" TO service_role;
GRANT ALL ON "folhas_obra" TO service_role;
GRANT ALL ON "items" TO service_role;
GRANT ALL ON "profiles" TO service_role;
GRANT ALL ON "roles" TO service_role;
GRANT ALL ON "users_with_profiles" TO service_role;

-- Verify permissions were granted
SELECT 
  table_name, 
  grantee, 
  privilege_type
FROM 
  information_schema.role_table_grants
WHERE 
  table_name IN ('folhas_obras', 'folhas_obra', 'items', 'profiles', 'roles', 'users_with_profiles')
  AND grantee IN ('authenticated', 'service_role')
ORDER BY 
  table_name, 
  grantee; 