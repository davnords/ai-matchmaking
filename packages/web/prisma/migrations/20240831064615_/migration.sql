/*
  Warnings:

  - A unique constraint covering the columns `[userId,questionNumber]` on the table `AnswerEmbedding` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AnswerEmbedding_userId_questionNumber_key" ON "AnswerEmbedding"("userId", "questionNumber");
