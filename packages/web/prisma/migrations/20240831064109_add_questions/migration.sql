/*
  Warnings:

  - A unique constraint covering the columns `[userId,questionId]` on the table `AnswerEmbedding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `AnswerEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnswerEmbedding" ADD COLUMN     "questionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_text_key" ON "Question"("text");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerEmbedding_userId_questionId_key" ON "AnswerEmbedding"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "AnswerEmbedding" ADD CONSTRAINT "AnswerEmbedding_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
