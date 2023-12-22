import GithubAuthProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../prisma'

export const nextAuthOptions: NextAuthOptions = {
    debug: false,
    providers: [
        GithubAuthProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: ({ session, user }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET!,
}
