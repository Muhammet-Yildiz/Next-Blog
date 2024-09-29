import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { signInSchema } from "@/lib/zod/types";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { ISession, ISessionUser } from "@/types/session";
import { OAuth2Client } from 'google-auth-library';

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_ID);
export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            allowDangerousEmailAccountLinking: true
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            allowDangerousEmailAccountLinking: true
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@gmail.com" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "username" },
            },
            async authorize(credentials) {

                const result = signInSchema.safeParse(credentials);

                if (result.success) {

                    const { email, password } = result.data;

                    if (!email || !password) throw new Error("Please enter your email and password");

                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        },
                    });

                    if (!user || !user?.hashedPassword) throw new Error("Your email address or password is incorrect");

                    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

                    if (!passwordMatch) throw new Error("Your email address or password is incorrect");
                    console.log("current username : " ,  user.username)
                    return user;
                }
                throw new Error("Invalid data provided");

            }

        }),
        CredentialsProvider({
            id: "googleonetap",
            name: "Google One Tap",
            credentials: {
              credential: { type: "text" },
            },
            async authorize(credentials) {

              const token = credentials?.credential;
              const ticket = await googleAuthClient.verifyIdToken({
                idToken: token as string,
                audience: process.env.NEXT_PUBLIC_GOOGLE_ID,
              });
          
              const payload = ticket.getPayload();
              if (!payload) throw new Error("Geçersiz token");
          
              const { email, sub, given_name, family_name, email_verified, picture: image } = payload;
              if (!email) throw new Error("Email bulunamadı");
          
              let user = await prisma.user.findUnique({ where: { email } });
              if (!user) {
                user = await prisma.user.create({
                  data: {
                    email,
                    name: `${given_name} ${family_name}`,
                    image,
                    emailVerified: email_verified ? new Date() : null,
                  },
                });
              }
          
              let account = await prisma.account.findFirst({
                where: { provider: "google", providerAccountId: sub },
              });
          
              if (!account) {
                await prisma.account.create({
                  data: {
                    userId: user.id,
                    provider: "google",
                    providerAccountId: sub,
                    type: "oauth",
                  },
                });
              }
          
              return user;
            },
          }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {

            return { ...token, ...user };
        },
        async session({ token, session, }: { token: JWT; session: Session; }): Promise<ISessionUser> {

            const user = await prisma.user.findUnique({
                where: {
                    email: session?.user?.email as string,
                },
            });
            return Promise.resolve({
                id: user?.id,
                username: user?.username || user?.name,
                email: session?.user?.email,
                image: user?.image,
                info: user?.info,
                followersIDs: user?.followersIDs,
                followingIDs: user?.followingIDs,
                savedPosts: user?.savedPosts,
                likedPosts: user?.likedPosts,
            } as ISessionUser);
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {

            return baseUrl;

        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV === "development",

}