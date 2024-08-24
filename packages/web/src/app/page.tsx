export const maxDuration = 60;

import { useSession } from "next-auth/react";
import LoginPage from "./LoginPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { FileUploadDemo } from "./FileUpload";
import { prisma } from "@/lib/prisma";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export interface SimilarityMatching {
  id: number;
  similarityScore: number,
  userId: string,
  email: string,
  name: string,
}

export default async function Home() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return (
      <LoginPage />
    )
  }
  const similarities = await prisma.similarity.findMany({
    where: {
      OR: [
        { user1Email: session.user.email },
        { user2Email: session.user.email }
      ]
    }, include: {
      user1: true,
      user2: true,
    }
  })
  const processedSimilarities = similarities.map(similarity => {
    const otherUser = similarity.user1Email === session?.user?.email ? similarity.user2 : similarity.user1;
    return {
      id: similarity.id,
      similarityScore: similarity.similarityScore,
      userId: otherUser.id,
      email: otherUser.email,
      name: otherUser.name,
    } as SimilarityMatching;
  })
    .sort((a, b) => b.similarityScore - a.similarityScore);

  const user = await prisma.user.findUnique({ where: { email: session?.user?.email ?? '' }, include: { similaritiesAsUser1: true, similaritiesAsUser2: true } })
  if (user?.trackOutSheet && user.trackOutSheet.length > 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 ">
        <div className="z-10 w-full max-w-5xl items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-xl font-semibold">Ranking of your co-founder matches</span>
            <span className="text-base text-gray-500">Results for {session.user.name}</span>
          </div>
          <DataTable columns={columns} data={processedSimilarities} />
        </div>
      </main>
    )
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 ">
      <div className="z-10 w-full max-w-5xl items-center">
        <FileUploadDemo />
      </div>
    </main>
  );
}
