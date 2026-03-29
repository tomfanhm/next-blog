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
    async session({ session, user }) {
      session.user.id = user.id;

      const dbUser = await getDb().user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });
      session.user.role = dbUser?.role ?? "user";

      return session;
    },
  },
});
