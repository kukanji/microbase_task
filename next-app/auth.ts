// "use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import prisma from "./db";
import { User } from "@prisma/client";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    return user as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // pathnameが/profileを含んでいたら
      const isOnProfile = nextUrl.pathname.includes("/profile");
      const isSignIn = nextUrl.pathname.includes("/sign-in");
      if (isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isSignIn) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/profile", nextUrl));
        }
        // return Response.redirect(new URL("/profile", nextUrl));
        return true;
      }
      return true;
    },
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        // 型を指定する
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // const passwordsMatch = await bcrypt.compare(password, user.password);
          const passwordsMatch = password === user.password;

          if (passwordsMatch)
            return { email: user.email, password: user.password };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
