import { supabase } from '../supabase/client';

// Helper function for adding timeout to promises
async function promiseWithTimeout<T>( 
  promise: Promise<T>,
  ms: number,
  timeoutError = new Error('Promise timed out')
): Promise<T> {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError);
    }, ms);
  });

  // Race the provided promise against the timeout
  return Promise.race([promise, timeout]);
}

export interface User {
  id: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    role: {
      id: string;
      name: string;
    };
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  /**
   * Login a user with email and password
   */
  static async login({ email, password }: LoginCredentials): Promise<User | null> {
    try {
      const startTime = performance.now();
      console.log("[AuthService] Starting login process for:", email);

      // Use Supabase Auth to sign in
      const authStartTime = performance.now();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      const authEndTime = performance.now();
      console.log(`[AuthService] Auth API call took ${(authEndTime - authStartTime).toFixed(2)}ms`);

      if (authError || !authData.user) {
        console.error('[AuthService] Authentication error:', authError);
        return null;
      }

      console.log("[AuthService] Auth successful for:", email);

      // TODO: Remove this hardcoded mapping once underlying profile/role
      // fetching issues (likely Supabase RLS) are resolved.
      // Simplified approach - just use hardcoded role mapping for now
      // This ensures login works even if profile fetch fails
      const roleMapping: Record<string, { roleId: string, roleName: string }> = {
        "maria.martins@imacx.pt": {
          roleId: "352eb27f-1e31-43ae-9052-8dd693b6d931",
          roleName: "Admin"
        },
        "admin@example.com": {
          roleId: "352eb27f-1e31-43ae-9052-8dd693b6d931",
          roleName: "Admin"
        },
        "geral@imacx.pt": {
          roleId: "some-user-role-id",
          roleName: "User"
        },
      };

      // Quick user object with fallback role data
      const fallbackUser = {
        id: authData.user.id,
        email: authData.user.email || '',
        profile: {
          firstName: email.split('@')[0].split('.')[0] || 'User',
          lastName: email.split('@')[0].split('.')[1] || '',
          role: {
            id: roleMapping[email]?.roleId || "",
            name: roleMapping[email]?.roleName || "User",
          }
        }
      };

      // Try to quickly fetch profile, but don't wait too long
      try {
        console.log("[AuthService] Attempting to fetch profile after login");
        const profileStartTime = performance.now();
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            first_name,
            last_name,
            role_id,
            roles:role_id (
              id,
              name
            )
          `)
          .eq('user_id', authData.user.id)
          .single(); // Keeping .single() here as login implies profile should exist
        const profileEndTime = performance.now();
        console.log(`[AuthService] Profile fetch took ${(profileEndTime - profileStartTime).toFixed(2)}ms`);

        if (!profileError && profile) {
          console.log("[AuthService] Profile found:", profile);

          // Use profile data if available
          fallbackUser.profile.firstName = profile.first_name || fallbackUser.profile.firstName;
          fallbackUser.profile.lastName = profile.last_name || fallbackUser.profile.lastName;

          // Handle roles data safely
          const roleData = profile.roles as { id?: string; name?: string } | null;
          if (roleData && roleData.name) {
              fallbackUser.profile.role.name = String(roleData.name);
              fallbackUser.profile.role.id = roleData.id ? String(roleData.id) : (profile.role_id || fallbackUser.profile.role.id);
          } else {
              // Fallback if joined role data is missing
              const fallbackRole = roleMapping[email] || { roleId: "", roleName: "User" };
              fallbackUser.profile.role.id = profile.role_id || fallbackRole.roleId;
              fallbackUser.profile.role.name = fallbackRole.roleName;
          }
        } else if (profileError) {
             console.error('[AuthService] Profile fetch error during login:', profileError);
             // Continue with fallback data if profile fetch fails during login
        } else {
             console.warn('[AuthService] No profile found during login for user:', authData.user.id);
             // Continue with fallback data
        }
      } catch (e) {
        console.log("[AuthService] Exception fetching profile, using fallback user data:", e);
      }

      const loginEndTime = performance.now();
      console.log(`[AuthService] Login process completed in ${(loginEndTime - startTime).toFixed(2)}ms`);
      console.log("[AuthService] Login successful, returning user data");
      return fallbackUser;
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      return null;
    }
  }

  /**
   * Register a new user
   */
  static async register({ email, password, firstName, lastName }: RegisterData): Promise<User | null> {
    try {
      // Use Supabase Auth to sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (authError || !authData.user) {
        console.error('Registration error:', authError);
        throw authError;
      }

      console.log("Registration successful for user:", authData.user.id);

      // Attempt to create the user profile
      let userRoleId = '';
      let userRoleName = 'User'; // Default role name

      try {
        // 1. Find the default 'User' role ID
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id, name')
          .eq('name', 'User') // Assuming 'User' is the exact name in the DB
          .single();

        if (roleError || !roleData) {
          console.error("Error fetching default 'User' role ID:", roleError);
          // Proceed without a specific role ID, or throw error depending on requirements
          // For now, we'll proceed but log the error. Profile creation might fail.
        } else {
          userRoleId = roleData.id;
          userRoleName = roleData.name; // Use the actual name from DB
          console.log("Found 'User' role ID:", userRoleId);
        }

        // 2. Insert into profiles table
        if (userRoleId) { // Only attempt insert if we found the role ID
            const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                user_id: authData.user.id,
                first_name: firstName,
                last_name: lastName,
                role_id: userRoleId,
            });

            if (profileError) {
                console.error("Error creating profile:", profileError);
                // Decide how to handle: maybe delete the auth user? Or just log?
                // Throwing error for now to indicate registration wasn't fully complete
                throw new Error(`User created, but profile creation failed: ${profileError.message}`);
            } else {
                console.log("Profile created successfully for user:", authData.user.id);
            }
        } else {
             console.warn("Could not find 'User' role ID. Profile not created.");
             // Depending on requirements, might want to throw an error here
        }

      } catch (profileCreationError) {
        console.error("Error during profile creation step:", profileCreationError);
        // Rethrow or handle as needed. If profile creation is critical, rethrow.
        throw profileCreationError;
      }

      // Return user data (role might still be default if creation failed but didn't throw)
      return {
        id: authData.user.id,
        email: email,
        profile: {
          firstName,
          lastName,
          role: {
            id: userRoleId, // Use the fetched ID if available
            name: userRoleName,
          },
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  static async logout(): Promise<void> {
    try {
      const startTime = performance.now();
      console.log("[AuthService] Attempting Supabase sign out...");

      // Check if we have a session before trying to sign out
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[AuthService] Current session before logout:", session ? "Valid session exists" : "No active session");

      // Perform the sign out
      const { error } = await supabase.auth.signOut();

      // Check session after logout attempt
      const { data: { session: postLogoutSession } } = await supabase.auth.getSession();
      console.log("[AuthService] Session after logout attempt:", postLogoutSession ? "Session still exists" : "Session cleared successfully");

      const endTime = performance.now();

      if (error) {
        console.error('[AuthService] Supabase sign out error:', error);
        throw error;
      }

      console.log(`[AuthService] Supabase sign out successful in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('[AuthService] Unexpected error during logout:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user and their profile
   */
  static async getCurrentUser(): Promise<User | null> {
    console.log("[AuthService] getCurrentUser - Starting...");
    const outerStartTime = performance.now();
    
    try {
      // 1. Get Session
      let session = null;
      const sessionStartTime = performance.now();
      try {
        console.log("[AuthService] Attempting supabase.auth.getSession() with 10s timeout...");
        // Wrap getSession with a 10-second timeout
        const { data, error } = await promiseWithTimeout(
          supabase.auth.getSession(), 
          10000, // 10 seconds timeout
          new Error('getSession timed out after 10 seconds')
        );
        console.log("[AuthService] supabase.auth.getSession() promise settled (or timed out).");
        if (error) {
            console.error("[AuthService] Error explicitly thrown from getSession:", error);
            throw error; 
        }
        session = data.session;
      } catch (sessionError) {
        // This will now also catch the timeout error
        console.error("[AuthService] Caught error getting session (or timed out):", sessionError);
        console.log("[AuthService] Returning NULL due to session error/timeout.");
        return null; 
      }
      const sessionEndTime = performance.now();
      console.log(`[AuthService] getSession took ${(sessionEndTime - sessionStartTime).toFixed(2)}ms`);

      if (!session?.user) {
        console.log("[AuthService] No active session found after getSession call.");
        console.log("[AuthService] Returning NULL due to no session.");
        return null; 
      }
      console.log("[AuthService] Session found for:", session.user.email);

      // 2. Get Profile (including Role)
      let profile = null;
      const profileStartTime = performance.now();
      try {
         console.log(`[AuthService] Attempting profile fetch for user: ${session.user.id}`);
         const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(
            `
            id,
            user_id,
            first_name,
            last_name,
            role_id,
            roles:role_id (
              id,
              name
            )
          `
          )
          .eq('user_id', session.user.id)
          .single();
         console.log("[AuthService] Profile fetch completed.");
          
         if (profileError) {
            console.error("[AuthService] Error explicitly thrown from profile fetch:", profileError);
            throw profileError;
         } 
         profile = profileData;
         
      } catch (profileFetchError) {
          console.error("[AuthService] Caught error fetching profile:", profileFetchError);
          console.log("[AuthService] Returning NULL due to profile fetch error.");
          return null; 
      }
       const profileEndTime = performance.now();
       console.log(`[AuthService] Profile fetch took ${(profileEndTime - profileStartTime).toFixed(2)}ms`);

      if (!profile) {
        console.warn("[AuthService] Profile data is null after fetch for user:", session.user.id);
        console.log("[AuthService] Returning NULL due to missing profile data.");
        return null; 
      }
       console.log("[AuthService] Profile found:", profile);

      // 3. Construct User object
       console.log("[AuthService] Constructing final user object...");
      const userResult: User = {
        id: session.user.id,
        email: session.user.email || '',
        profile: {
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: {
            id: (profile.roles as any)?.id || profile.role_id || '', 
            name: (profile.roles as any)?.name || 'Unknown', 
          },
        },
      };
      
      const outerEndTime = performance.now();
      console.log(`[AuthService] getCurrentUser - Completed successfully in ${(outerEndTime - outerStartTime).toFixed(2)}ms`);
      console.log("[AuthService] Returning userResult:", userResult);
      return userResult;

    } catch (error) {
      console.error("[AuthService] Caught unexpected outer error in getCurrentUser:", error);
      console.log("[AuthService] Returning NULL due to outer error.");
      return null;
    }
  }

  /**
   * Send a password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(password: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }
}