import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/db/prisma"

// REMOVE THESE INTERFACES (Handled by types/next-auth.d.ts)
/*
interface UserType { ... }
interface TokenType extends JWT { ... }
*/

const { handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login", signOut: "/login", error: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Ensure credentials config is present if required by the type
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) { // Removed explicit type here, let TS infer
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        })

        if (!user) return null

        // IMPORTANT: Replace this with actual bcrypt.compare
        // const isValid = await bcrypt.compare(credentials.password, user.password);
        // if (!isValid) return null;
        const isValid = credentials.password === user.encrypted_password; // Placeholder
        if (!isValid) return null;

        // Return object matching User type + custom fields
        return {
          id: user.id,
          email: user.email,
          role: user.role, // Include custom role field
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user object exists (on sign in), add custom fields to token
      if (user) {
        token.id = user.id
        // Cast user to include role, assuming authorize returns it
        token.role = (user as any).role
        // Other default fields like name, email, picture are usually handled automatically
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields from token to session
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role // Role comes from the JWT token
      }
      return session
    },
  },
})

export const { GET, POST } = handlers