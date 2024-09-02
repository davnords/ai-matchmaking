-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACCEPTED', 'PENDING', 'DECLINED');

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'PENDING',
    "senderUserEmail" TEXT NOT NULL,
    "receivingUserEmail" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_senderUserEmail_fkey" FOREIGN KEY ("senderUserEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_receivingUserEmail_fkey" FOREIGN KEY ("receivingUserEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
