/*
  Warnings:

  - Made the column `useComplementary` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "useComplementary" SET NOT NULL,
ALTER COLUMN "useComplementary" SET DEFAULT true;
