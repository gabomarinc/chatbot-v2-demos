import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = signInSchema.safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({ where: { email } })

                    if (!user) return null

                    // Verify password hash
                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
                    if (passwordsMatch) {
                        // Update lastLoginAt
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { lastLoginAt: new Date() }
                        })
                        
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role: user.role,
                        };
                    }
                }

                return null
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // New session - use data from user object
                token.id = user.id
                token.role = user.role
                token.name = user.name
                token.email = user.email
            } else if (token.id && (!token.name || !token.email)) {
                // Only fetch from database if name or email is missing from token
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { name: true, email: true, role: true }
                })
                if (dbUser) {
                    token.name = dbUser.name
                    token.email = dbUser.email
                    token.role = dbUser.role
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
                session.user.role = token.role as any
                if (token.name !== undefined) {
                    session.user.name = token.name || null
                }
                if (token.email !== undefined && token.email) {
                    session.user.email = token.email
                }
            }
            return session
        },
    },
})
