import { createRouteHandlerClient, createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

/**
 * Creates a Supabase client for use in server actions with proper cookie handling
 * This helper ensures cookies are handled asynchronously to avoid warnings
 */
export function createServerAction() {
  const cookieStore = cookies();
  return createServerActionClient<Database>({
    cookies: async () => cookieStore
  });
}

/**
 * Creates a Supabase client for use in API routes with proper cookie handling
 * This helper ensures cookies are handled asynchronously to avoid warnings
 */
export function createApiClient() {
  const cookieStore = cookies();
  return createRouteHandlerClient<Database>({
    cookies: async () => cookieStore
  });
}

/**
 * Creates a Supabase client for use in Server Components with proper cookie handling
 * This helper ensures cookies are handled asynchronously to avoid warnings
 */
export function createServerComponent() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: async () => cookieStore
  });
} 