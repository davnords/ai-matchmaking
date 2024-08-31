/*
  Warnings:

  - Added the required column `questionNumber` to the `AnswerEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnswerEmbedding" ADD COLUMN     "questionNumber" INTEGER NOT NULL;
