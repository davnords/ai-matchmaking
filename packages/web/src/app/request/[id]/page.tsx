import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function RequestPage({ params }: { params: { id: string } }) {
    const request = await prisma.request.update({
        where: {
            id: params.id
        },
        data: {
            status: 'ACCEPTED'
        }
    })
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24">
            <div className="z-10 w-full max-w-5xl items-center">
                <div className="flex flex-col space-y-1 mb-2">
                    <span className="text-xl font-semibold text-green-500">Accepted Invite</span>
                    <span>You have now accepted the invite from {request.senderUserEmail} to view your track-out sheet. </span>
                </div>
                <Link href={'/'}>
                    <Button>Navigate to dashboard</Button>
                </Link>
            </div>
        </main>
    )
}
