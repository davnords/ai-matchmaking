
import { useSession } from "next-auth/react";
import LoginPage from "./LoginPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { FileUploadDemo } from "./FileUpload";
import { prisma } from "@/lib/prisma";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Home() {
  const session = await getServerSession()
  if (!session) {
    return (
      <LoginPage />
    )
  }
  const users = await prisma.user.findMany()
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email ?? '' }, include: { similaritiesAsUser1: true, similaritiesAsUser2: true } })
  if (user?.trackOutSheet) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center">
          <span className="text-xl font-semibold">Co-founder ranking</span>
          <DataTable columns={columns} data={users}  />
        </div>
      </main>
    )
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center">
        <FileUploadDemo />
      </div>
    </main>
  );
}
