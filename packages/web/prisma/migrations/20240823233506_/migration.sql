/*
  Warnings:

  - You are about to drop the column `user1Id` on the `Similarity` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Similarity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user1Email,user2Email]` on the table `Similarity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user1Email` to the `Similarity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Email` to the `Similarity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Similarity" DROP CONSTRAINT "Similarity_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Similarity" DROP CONSTRAINT "Similarity_user2Id_fkey";

-- DropIndex
DROP INDEX "Similarity_user1Id_user2Id_key";

-- AlterTable
ALTER TABLE "Similarity" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "user1Email" TEXT NOT NULL,
ADD COLUMN     "user2Email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Similarity_user1Email_user2Email_key" ON "Similarity"("user1Email", "user2Email");

-- AddForeignKey
ALTER TABLE "Similarity" ADD CONSTRAINT "Similarity_user1Email_fkey" FOREIGN KEY ("user1Email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Similarity" ADD CONSTRAINT "Similarity_user2Email_fkey" FOREIGN KEY ("user2Email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
