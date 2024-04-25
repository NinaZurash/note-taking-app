import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "" },
        password: { label: "password", type: "" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const existingUser = credentials.username.includes("@")
          ? await db.user.findUnique({
              where: { email: credentials.username },
            })
          : await db.user.findUnique({
              where: { username: credentials.username },
            });
        if (!existingUser || !existingUser.password) {
          return null;
        }
        const isValid = await compare(
          credentials.password,
          existingUser.password
        );
        if (!isValid) {
          return null;
        }
        return {
          id: existingUser.id,
          email: existingUser.email,
          username: existingUser.username,
          emailVerified: existingUser.emailVerified,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          emailVerified: token.emailVerified,
          username: token.username,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          email: user.email,
          emailVerified: user.emailVerified,
          username: user.username,
        };
      }
      return token;
    },
    // async signIn({ user }) {
    //   return user.emailVerified
    //     ? `${BASE_URL}`
    //     : `${BASE_URL}/email-verification`;
    // },
  },
};
