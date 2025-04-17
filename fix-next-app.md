# Fix for Next.js Authentication Issues

## Diagnosis

Based on our testing, there are two key issues affecting your application:

1. **Authentication Rate Limiting**: Your authentication calls are hitting Supabase's rate limits
2. **Cookie Handling in API Routes**: Your API routes are using cookies synchronously instead of asynchronously

## Fix 1: Rate Limiting in Login Form

Add debouncing and rate limit handling to your login form:

```tsx
// In your login component (e.g., app/login/page.tsx)
import { useCallback, useState } from 'react';
import { debounce } from 'lodash'; // Add this dependency if not already installed

// Add state for login status
const [isSubmitting, setIsSubmitting] = useState(false);
const [loginError, setLoginError] = useState<string | null>(null);

// Create debounced submit handler
const debouncedSubmit = useCallback(
  debounce(async (email, password) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        if (error.message === 'Request rate limit reached') {
          setLoginError('Too many login attempts. Please wait a moment before trying again.');
        } else {
          setLoginError(error.message);
        }
      } else {
        // Redirect on success
        router.push('/dashboard');
      }
    } catch (error: any) {
      setLoginError(error.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  }, 500), // 500ms debounce
  []
);

// Your form submit handler
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!isSubmitting) {
    debouncedSubmit(email, password);
  }
};

// In your form JSX:
<button 
  type="submit" 
  disabled={isSubmitting} 
  className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
>
  {isSubmitting ? 'Logging in...' : 'Log in'}
</button>

{loginError && (
  <div className="text-red-500 mt-2">
    {loginError}
  </div>
)}
```

## Fix 2: Cookie Handling in API Routes

Your `lib/supabase/server.ts` already has the correct implementation with `cookies: async () => cookieStore`, however some of your API routes might not be using these helper functions correctly.

Check all files in your `app/api` directory and ensure they're using the helpers from `lib/supabase/server.ts` instead of creating their own Supabase clients.

Example code that's correct:

```tsx
import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase/server';

export async function GET() {
  // Correctly using the helper function
  const supabase = createApiClient();
  
  // Rest of your code
}
```

## Additional Recommendations

1. **SQL Editor Fix**: Run the SQL in `fix-permissions.sql` in your Supabase SQL Editor to fix the table permissions.

2. **Clean up session management**: Your API routes and middleware show errors with refresh tokens. Make sure you're properly managing authentication state:

```tsx
// In your login success handler:
// Store a flag indicating successful login
localStorage.setItem('auth_success', 'true');

// In your app layout or session context provider:
useEffect(() => {
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && localStorage.getItem('auth_success')) {
        // Session was lost but we thought we were logged in
        // Clear the auth flag and redirect to login
        localStorage.removeItem('auth_success');
        router.push('/login');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };
  
  checkSession();
  
  // Set up auth state change listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      localStorage.setItem('auth_success', 'true');
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('auth_success');
    }
  });
  
  return () => subscription.unsubscribe();
}, []);
```

These changes will help your application handle authentication more reliably and avoid rate limiting issues. 