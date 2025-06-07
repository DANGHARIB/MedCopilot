/*
  Warnings:

  - You are about to drop the column `degree` on the `AcademicInfo` table. All the data in the column will be lost.
  - You are about to drop the column `gpa` on the `AcademicInfo` table. All the data in the column will be lost.
  - You are about to drop the column `dateFrom` on the `AdditionalActivity` table. All the data in the column will be lost.
  - You are about to drop the column `dateTo` on the `AdditionalActivity` table. All the data in the column will be lost.
  - You are about to drop the column `dateFrom` on the `MeaningfulExperience` table. All the data in the column will be lost.
  - You are about to drop the column `dateTo` on the `MeaningfulExperience` table. All the data in the column will be lost.
  - Added the required column `totalHours` to the `AdditionalActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization` to the `MeaningfulExperience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHours` to the `MeaningfulExperience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicInfo" DROP COLUMN "degree",
DROP COLUMN "gpa",
ADD COLUMN     "cumulativeGpa" DOUBLE PRECISION,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "mcatDate" TIMESTAMP(3),
ADD COLUMN     "mcatScore" INTEGER,
ADD COLUMN     "minor" TEXT,
ADD COLUMN     "scienceGpa" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "AdditionalActivity" DROP COLUMN "dateFrom",
DROP COLUMN "dateTo",
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "totalHours" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MeaningfulExperience" DROP COLUMN "dateFrom",
DROP COLUMN "dateTo",
ADD COLUMN     "organization" TEXT NOT NULL,
ADD COLUMN     "totalHours" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "citizenship" TEXT,
ADD COLUMN     "gender" TEXT;
