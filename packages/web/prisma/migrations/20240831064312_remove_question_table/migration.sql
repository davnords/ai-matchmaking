/*
  Warnings:

  - You are about to drop the column `questionId` on the `AnswerEmbedding` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `question` to the `AnswerEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnswerEmbedding" DROP CONSTRAINT "AnswerEmbedding_questionId_fkey";

-- DropIndex
DROP INDEX "AnswerEmbedding_userId_questionId_key";

-- AlterTable
ALTER TABLE "AnswerEmbedding" DROP COLUMN "questionId",
ADD COLUMN     "question" TEXT NOT NULL;

-- DropTable
DROP TABLE "Question";
