'use server'

import { NextRequest } from "next/server";
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
                const trackOutSheet = user.trackOutSheet as unknown as TrackOutRow[]
                if (trackOutSheet?.length > 0) {
                    const response = await processSimilarity(cellValues, trackOutSheet)
                    if (response) {
                        const similarity = await prisma.similarity.create({
                            data: {
                                user1Email: session.user.email,
                                user2Email: user.email,
                                similarityScore: response
                            }
                        });
                    } else {
                        console.log('Something went wrong processing a user')
                    }
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

async function processSimilarity(currentUserData: TrackOutRow[], otherUserData: TrackOutRow[]) {
    try {
        const tools = [
            {
                type: "function",
                function: {
                    name: "set_founder_similarity_score",
                    description: "Set the founder similarity score between two founders. ",
                    parameters: {
                        type: "object",
                        properties: {
                            similarityScore: {
                                type: "number",
                                description: "The degree to which these founders are a good match based on the answers they have provided to the questions.",
                                minimum: 0,
                                maximum: 1
                            },
                        },
                        required: ["similarityScore"],
                        additionalProperties: false,
                    },
                }
            }
        ];
        if (currentUserData.length !== otherUserData.length) {
            console.log('Lengths are not matching')
            return null
        }

        const processedData = currentUserData.map((c, index) => {
            return `
            Question: ${c.question}
            
            Founder 1 answer: ${c.answer}
            
            Founder 2 answer: ${otherUserData?.[index]?.answer}
            
            `
        }).join("\n\n")

        const messages = [
            { role: "system", content: "You are a founder matchmaker. Your job is to process start-up founders answers to important questions and set a matchmaking score based on their compatibility in starting a start up together." },
            {
                role: "user", content: `Hi, can you process these two founders and set a similarity score based on how well they would match eacother starting a startup?
                Here is the data: ${processedData}
                ` }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages as any,
            temperature: 0,
            tools: tools as any,
        });
        const toolCall = response.choices[0]?.message.tool_calls?.[0];
        if (toolCall?.function.arguments) {
            const functionArguments = JSON?.parse(toolCall?.function.arguments);
            const score = functionArguments?.similarityScore as number
            return score
        } else {
            console.log('OpenAI API error')
            return null
        }
    } catch (error) {
        console.log('OpenAI API error', error)
        return null
    }
}