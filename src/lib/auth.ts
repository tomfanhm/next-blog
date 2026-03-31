import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { getDb } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { id: string; role: string };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(getDb()),
  providers: [GitHub, Google],
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      // PrismaAdapter returns the full User row which includes `role`.
      // Cast to access it directly instead of making an extra DB query.
      session.user.role = (user as unknown as { role: string | null }).role ?? "user";
      return session;
    },
  },
});
