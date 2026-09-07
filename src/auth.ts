import "server-only";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Fail fast in production if the app is misconfigured, instead of silently
// signing tokens with an undefined/weak secret.
if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET is required in production. Generate one with `openssl rand -base64 32` and set it in your environment."
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Always run bcrypt.compare, even for a nonexistent user, against a
          // fixed dummy hash. This keeps response timing consistent so the
          // API can't be used to enumerate which emails have accounts.
          const passwordHash =
            user?.password ??
            "$2a$12$CwTycUXWue0Thq9StjUM0uJ8y2p2r/2mqExd1uJ2SEmXaEHNq9F0y";
          const isValid = await bcrypt.compare(credentials.password, passwordHash);

          if (!user || !isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          // Never let a DB error leak details to the client; treat as a
          // failed login rather than throwing through NextAuth.
          console.error("Authorize error", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
