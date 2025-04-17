import type { DefaultSession, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    id: string; // Add your custom property
    role: string; // Add your custom property
    // Add any other properties you attach to the token
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Add your custom property
      role: string; // Add your custom property
      // Add any other properties you attach to the user object
    } & DefaultSession["user"]; // Keep the default properties
  }

  // If you also customize the User model returned by the adapter/authorize, declare it here
  // interface User {
  //   role?: string;
  // }
} 