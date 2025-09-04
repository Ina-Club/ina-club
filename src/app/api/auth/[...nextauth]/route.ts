import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email + Resend
    EmailProvider({
      from: process.env.EMAIL_FROM!,
      maxAge: 24 * 60 * 60,
      sendVerificationRequest: async ({ identifier, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: identifier,
          subject: "Your sign-in link",
          html: `<p>Click the link to sign in:</p><p><a href="${url}">Sign in</a></p>`,
          text: `Sign in link: ${url}`,
        });
        if (error) throw new Error(error.message);
      },
    }),

    // Credentials (Email/Password)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email, image: undefined };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
    verifyRequest: "/auth/signin",
  },

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // עדיפות לחשבון Google על פני חשבון רגיל
    async signIn({ user, account }) {
      if (!account) return true;

      const existingUser = await prisma.user.findUnique({ where: { email: user.email! } });

      if (account.provider === "google") {
        if (existingUser) {
          // קישור חשבון Google למשתמש קיים
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
            update: {
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              id_token: account.id_token,
            },
          });

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name ?? existingUser.name,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },

  events: {
    // PendingProfile merge
    async signIn(message) {
      if (message.user?.email) {
        const email = message.user.email;
        const pending = await (prisma as any).pendingProfile.findUnique({ where: { email } });
        if (pending) {
          await prisma.user.update({
            where: { email },
            data: {
              name: pending.name,
              password: pending.hashedPassword,
              profilePicture: pending.imageUrl
                ? {
                    upsert: {
                      create: { url: pending.imageUrl },
                      update: { url: pending.imageUrl },
                    },
                  }
                : undefined,
            },
          });
          await (prisma as any).pendingProfile.delete({ where: { email } });
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
