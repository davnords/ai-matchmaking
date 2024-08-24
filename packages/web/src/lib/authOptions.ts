import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getStringFromBuffer } from "@/lib/utils";


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            id: "credentials",
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "john.doe@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6)
                    })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({ where: { email: email } })

                    if (!user) return null

                    const encoder = new TextEncoder()
                    const saltedPassword = encoder.encode(password + user.salt)
                    const hashedPasswordBuffer = await crypto.subtle.digest(
                        'SHA-256',
                        saltedPassword
                    )
                    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

                    if (hashedPassword === user.password) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            img: user.image,
                        }
                    } else {
                        return null
                    }
                }

                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token = { ...token, id: user.id }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                const { id } = token as { id: string }
                const { user } = session
                // session = { ...session, user: { ...user, id } }
                session = { ...session, user: { ...user } }
            }

            return session
        }
    }
}
