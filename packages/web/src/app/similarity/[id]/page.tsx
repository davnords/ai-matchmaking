import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Slash } from 'lucide-react'

const questions = [
    {
        "question": "Why do you want to start a company — in general, and in particular right now?"
    },
    {
        "question": "What is success to you? What motivates you personally?"
    },
    {
        "question": "Is control or success more important? (i.e. Are you willing to step aside if the company is more likely to have a financially successful outcome or is it important for the founders to stay in control of the company’s destiny?)"
    },
    {
        "question": "Is there anything your co-founders should know that may materially affect your time or legal status as a founder? (e.g. visa, green card, criminal record)"
    },
    {
        "question": "Will this company be your primary activity? Do you have any other time commitments? If so, how much time will you spend on external committments, and for how long will you do so?"
    },
    {
        "question": "What is your expected time commitment right now? How do you see that changing in the next 6 months? 2 years? 5 years?"
    },
    {
        "question": "What times of the day would you prefer to work (Ie. start 7am or 10am; not work past 6pm, etc...)? How do you feel about working on weekends?"
    },
    {
        "question": "How many hrs are you prepared to put in on weekly basis building our company? What sounds good? What sounds like hell? Do you have different expectations for different phases of the company’s lifespan? (i.e. willing to work harder in the beginning)"
    },
    {
        "question": "Where should your startup be based? Where do you incorporate it?"
    },
    {
        "question": "What are 3 words to describe the team culture you want to create (e.g. open, hard-working, eccentric)?"
    },
    {
        "question": "How do you feel about remote or distributed teams? If you have a physical office, how much would you want to work from home?"
    },
    {
        "question": "How much would you expect your employees to work?"
    },
    {
        "question": "What processes or techniques would you use to get the most out of your team? For example, how would you help them become better managers or achieve their goals?"
    },
    {
        "question": "How much of your time do you hope to spend either working or socializing with coworkers? How close or distant would you keep the relationship (ie. Purely professional? Should you all be best friends?) "
    },
    {
        "question": "How important is diversity & inclusion? Concretely, how would you put that into action?"
    },
    {
        "question": "How do you react to extreme external pressure?"
    },
    {
        "question": "Can one co-founder fire another co-founder? Can someone else fire a founder?"
    },
    {
        "question": "What do you need to re-charge?"
    },
    {
        "question": "How would you resolve personal conflict between co-founders? How about stalemates?"
    },
    {
        "question": "In case this becomes part of your partnership’s evolution, how would you go about handling a startup divorce? Who would leave and who would stay with the company?"
    },
    {
        "question": "What happens in the scenario where you aren’t growing? How would you diagnose the problem? How have each of your capabilities and approach contributed to growth failures in your pasts?"
    },
    {
        "question": "How will decisions be made? Are our voices equally valubale, or can someone outvote the other?"
    },
    {
        "question": "How do you think we should give feedback to each other (frequency, channel)?"
    },
    {
        "question": "How would you think about bringing on a third (or N+1) cofounder?"
    },
    {
        "question": "How should founder equity be set? What’s your philosophy on an employee equity pool?"
    },
    {
        "question": "What is your approach to fundraising? How much will you raise? (i.e. “zero” to “as much as we can”) In the range of “bootstrapped small business” to “go big or go home” -- where do you want this startup to go?"
    },
    {
        "question": "What does an ideal company exit look like to you? (i.e. “work on company for 1-2 years and sell for 7 figures” to “work for 10 + years, reach 9 figures in revenue, and IPO”)"
    },
    {
        "question": "How do you think about the timeframe and pace of success? Are you willing to take the longer path? How long is too long?"
    },
    {
        "question": "What number would you sell at? How would that change if you got extra liquidity from your existing positions?"
    },
    {
        "question": "How much dilution are you prepared to have along the way?"
    },
    {
        "question": "What is your personal runway? How long can you continue building with your current burn rate? Would you invest your own money in the business (ideally retaining higher equity in return)?"
    },
    {
        "question": "What is the minimum monthly salary you need to survive? To be comfortable? To feel like you’ve “made it?”"
    }
]

export interface SimilarityData {
    question: string;
    similarity?: number;

}

export default async function SimilarityPage({ params }: { params: { id: string } }) {
    const similarity = await prisma.similarity.findUnique({ where: { id: parseInt(params.id) } })

    const session = await getServerSession(authOptions)
    if (!(session?.user?.email === similarity?.user1Email || session?.user?.email === similarity?.user2Email)) {
        return (
            <div>You are in the wrong neighborhood my brother.</div>
        )
    }
    const otherUser = similarity?.user1Email === session?.user?.email ? similarity?.user2Email : similarity?.user1Email;
    const data = questions.map((row, index) => {
        return {
            question: row.question,
            similarity: similarity?.similarityScores[index]
        } as SimilarityData
    })
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24">
            <div className="z-10 w-full max-w-5xl items-center">
                <div className="flex flex-col space-y-1 mb-2">
                    <span className="text-xl font-semibold">Similarity of answers</span>
                </div>
                <Breadcrumb className='mb-2'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Matches</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <Slash />
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <BreadcrumbPage>{otherUser}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <DataTable columns={columns} data={data} />
            </div>
        </main>
    )
}
