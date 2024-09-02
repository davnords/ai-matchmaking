'use server'
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache';

export async function sendRequestEmail(otherUserEmail: string, senderEmail: string, requestId: string) {
    const receiverUser = await prisma.user.findUnique({ where: { email: otherUserEmail } })
    const senderUser = await prisma.user.findUnique({ where: { email: senderEmail } })
    if (!receiverUser || !senderUser) {
        return {
            result: 'error',
            message: 'Invalid users'
        }
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_EMAIL_PASSWORD,
            },
        });
        if (!process.env.JWT_SECRET) {
            return {
                result: 'error',
                message: 'No JSON webtoken .env'
            }
        }
        const request = {
            requestingUser: senderUser,
            receivingUser: receiverUser,
        }
        const token = jwt.sign(request, process.env.JWT_SECRET)
        const id = crypto.randomUUID()
        await prisma.request.create({
            data: {
                id: id,
                status: 'PENDING',
                senderUser: {
                    connect: {
                        email: senderUser.email
                    }
                },
                receivingUser: {
                    connect: {
                        email: receiverUser.email
                    }
                }
            }
        })
        await transporter.sendMail({
            from: process.env.SUPPORT_EMAIL,
            to: otherUserEmail,
            subject: `${senderUser.name} has requested your answers`,
            html: `
            <h2>${senderUser.name} wants to know your track-out sheet answers!</h2>
            <p>Hi ${receiverUser.name}, you have been asked to share your track-out answers with ${senderUser.name}. <b>Press the link below to accept.</b></p>
            <p>Accept by clicking <a href="${process.env.NEXT_PUBLIC_HOSTING_URL}/request/${id}">HERE</a>.</p>
            <p>Kindest regards,</p>
            <p>David Nordström.</p>
          `,
        });
        revalidatePath(`/request/${requestId}`)
        return {
            result: 'success',
            message: 'Request succesfully sent...'
        }
    } catch (error) {
        return {
            result: 'error',
            message: 'Something went wrong...'
        }
    }

}