'use server'

import { NextRequest } from "next/server";
import * as ExcelJS from 'exceljs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

interface TrackOutRow {
    question: string
    answer: string
}

export async function processExcelFile(formData: FormData) {
    const file = formData.get("file") as File;
    const session = await getServerSession(authOptions)
    if (!file) {
        return { error: "No file uploaded" };
    }

    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }


    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];

        if (worksheet) {
            const cellValues: TrackOutRow[] = [];

            // Function to process a range of cells
            const processCellRange = (start: number, end: number) => {
                for (let i = start; i <= end; i++) {
                    const question = worksheet.getCell(`C${i}`);
                    const answer = worksheet.getCell(`D${i}`);
                    cellValues.push({ question: question.text, answer: answer.text })
                }
            };

            processCellRange(14, 22);
            processCellRange(25, 30);
            processCellRange(33, 41);
            processCellRange(56, 63);

            const users = await prisma.user.findMany({
                where: {
                    email: {
                        not: session.user.email
                    }
                }
            })
            for (const user of users) {
                const similarity = await prisma.similarity.create({
                    data: {
                        user1Email: session.user.email,
                        user2Email: user.email,
                        similarityScore: Math.random()
                    }
                });
            }

            await prisma.user.update({
                where: { email: session.user.email }, data: {
                    trackOutSheet: cellValues as [],
                }
            })



            return { success: "Huge success!!" };
        } else {
            return { error: "No worksheet found in the Excel file" };
        }
    } catch (err) {
        console.error(err);
        return { error: "Error processing the Excel file" };
    }
}