'use server'

import * as ExcelJS from 'exceljs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

interface TrackOutRow {
    question: string
    answer: string
}


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function processExcelFile(formData: FormData) {
    const file = formData.get("file") as File;
    const session = await getServerSession(authOptions)
    if (!file) {
        return { error: "No file uploaded" };
    }


    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })

    if (!user) {
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

            const cellC14 = worksheet.getCell("C14")
            if (!cellC14.text.startsWith("Why do you want to start a company")) {
                return { error: "Your track-out sheet does not match the format required or it was parsed incorrectly" };
            }

            processCellRange(14, 22);
            processCellRange(25, 30);
            processCellRange(33, 41);
            processCellRange(56, 63);


            const embeddingArray = []
            let i = 0;
            for (const row of cellValues) {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: row.answer,
                    encoding_format: 'float',
                })
                const normalizedEmbedding = normalizeEmbedding(embedding.data[0].embedding);

                embeddingArray.push({
                    answer: row.answer,
                    question: row.question,
                    questionNumber: i,
                    embedding: normalizedEmbedding,
                })
                i++;
            }

            await prisma.answerEmbedding.createMany({
                data: embeddingArray.map(embedding => ({
                    userId: user.id,
                    question: embedding.question,
                    questionNumber: embedding.questionNumber,
                    answer: embedding.answer,
                    embedding: embedding.embedding
                })),
            });

            const users = await prisma.user.findMany({
                where: {
                    email: {
                        not: session.user.email
                    }
                },
                include: {
                    answerEmbeddings: {
                        orderBy: { questionNumber: 'asc' }
                    }
                }
            })


            for (const user of users) {
                const userEmbeddings = user.answerEmbeddings
                if (userEmbeddings.length > 0) {
                    const similarityScores = [];
                    for (let k = 0; k < userEmbeddings.length; k++) {
                        const embedding1 = embeddingArray[k].embedding
                        const embedding2 = userEmbeddings[k].embedding

                        const similarity = cosineSimilarity(embedding1, embedding2);
                        similarityScores.push(similarity);
                    }
                    await prisma.similarity.create({
                        data: {
                            user1Email: session.user.email,
                            user2Email: user.email,
                            similarityScores,
                        }
                    });
                }
            }

            await prisma.user.update({
                where: { email: session.user.email }, data: {
                    trackOutSheet: cellValues as [],
                }
            })

            revalidatePath('/')
            return { success: "Huge success!!" };
        } else {
            return { error: "No worksheet found in the Excel file" };
        }
    } catch (err) {
        console.error(err);
        return { error: "Error processing the Excel file" };
    }
}

function normalizeEmbedding(embedding: number[]): number[] {
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct: number = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    // Since vectors are normalized, we don't need to divide by magnitudes
    return dotProduct;
}

export async function changeUserChoice(userId: string, choice: boolean) {
    await prisma.user.update({
        where: { id: userId }, data: {
            useComplementary: choice
        }
    })
    revalidatePath('/')
}