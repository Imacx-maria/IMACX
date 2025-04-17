# Cookie Handling in Supabase Authentication

## Problem

The project was experiencing authentication issues with Supabase due to improper cookie handling. This led to:

1. Rate limiting errors: `AuthApiError: Request rate limit reached`
2. Console warnings: `Route "/api/xxx" used cookies().get('sb-...') which should be awaited before using its value`
3. Authentication failures in API routes
4. Persistent auth token refreshing issues

## Solution

We've implemented several fixes to address these issues:

1. Added a helper module in `lib/supabase/server.ts` that provides properly configured Supabase clients:
   - `createApiClient()` - For API route handlers
   - `createServerAction()` - For server actions
   - `createServerComponent()` - For server components

2. Updated API routes to use these helper functions, ensuring cookies are properly handled asynchronously:
   - `app/api/test-table-access/route.ts`
   - `app/api/fix-tables-access/route.ts`
   - `app/api/test-supabase/auth/route.ts`

3. Ensured all cookie handling is done with the async pattern:
   ```typescript
   // 🚫 WRONG - This causes rate limiting errors
   const supabase = createRouteHandlerClient({
     cookies: () => cookies()
   });

   // ✅ CORRECT - Use this pattern
   const supabase = createRouteHandlerClient({
     cookies: async () => cookies()
   });
   ```

## Best Practices

1. **Never** use `cookies()` synchronously - always wrap with the async pattern
2. Use the helper functions in `lib/supabase/server.ts` to create properly configured clients
3. Do not create multiple Supabase clients in the same component/function unless absolutely necessary
4. If you see rate limiting errors, check for improper cookie handling

## Technical Details

The Next.js 13+ App Router requires that cookie handling is done with care since cookies are a dynamic function. The `cookies()` function needs to be awaited before its values are used.

When Supabase clients are created without the async wrapper, they synchronously access cookies which leads to warnings and eventually rate limiting as too many token refresh attempts are made in a short time period.

The helper module simplifies correct usage and prevents these errors. 