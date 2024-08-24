'use server'

import { prisma } from '@/lib/prisma'
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { z } from 'zod'


export async function createUser(
    email: string,
    name: string,
    hashedPassword: string,
    salt: string
) {
    const existingUser = await prisma.user.findUnique({ where: { email: email } })
    if (existingUser) {
        return {
            type: 'error',
            resultCode: ResultCode.UserAlreadyExists
        }
    } else {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
                salt: salt,
            }
        })

        return {
            type: 'success',
            resultCode: ResultCode.UserCreated
        }
    }
}

interface Result {
    type: string
    resultCode: ResultCode
}

export async function signup(
    _prevState: Result | undefined,
    formData: FormData
): Promise<Result | undefined> {
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = formData.get('password') as string

    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password: z.string().min(6)
        })
        .safeParse({
            email,
            password,
        })

    if (parsedCredentials.success) {

        const salt = crypto.randomUUID()

        const encoder = new TextEncoder()
        const saltedPassword = encoder.encode(password + salt)
        const hashedPasswordBuffer = await crypto.subtle.digest(
            'SHA-256',
            saltedPassword
        )
        const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

        try {
            const result = await createUser(email, name, hashedPassword, salt)
            return result
        } catch (error) {
            return {
                type: 'error',
                resultCode: ResultCode.InvalidCredentials
            }
        }
    } else {
        return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
        }
    }
}
