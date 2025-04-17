import { supabase } from '../supabase/client';

// Simple User type without profile/role dependencies
export interface SimpleUser {
  id: string;
  email: string;
  isAdmin?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export class SimpleAuthService {
  /**
   * Login a user with email and password
   */
  static async login({ email, password }: LoginCredentials): Promise<SimpleUser | null> {
    try {
      console.log("Attempting sign in with:", email);
      
      // Use Supabase Auth to sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("Sign in response:", authData, authError);
      
      if (authError || !authData.user) {
        console.error('Authentication error:', authError);
        return null;
      }
      
      // Create a simplified user object
      return {
        id: authData.user.id,
        email: authData.user.email || '',
        // Determine admin status from metadata or email domain
        isAdmin: authData.user.email === 'maria.martins@imacx.pt',
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<SimpleUser | null> {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
      
      return {
        id: session.user.id,
        email: session.user.email || '',
        isAdmin: session.user.email === 'maria.martins@imacx.pt',
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Logout the current user
   */
  static async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
} 