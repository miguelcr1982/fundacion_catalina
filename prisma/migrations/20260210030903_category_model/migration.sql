/*
  Warnings:

  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable category first
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AlterTable - Add categoryId as nullable first
ALTER TABLE "Course" ADD COLUMN "categoryId" TEXT;

-- Insert categories from existing distinct category values
INSERT INTO "category" (id, name, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  "category",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course"
WHERE "category" IS NOT NULL
GROUP BY "category"
ON CONFLICT ("name") DO NOTHING;

-- Update Course with categoryId from category names
UPDATE "Course" c
SET "categoryId" = cat.id
FROM "category" cat
WHERE c."category" = cat."name";

-- Make categoryId NOT NULL
ALTER TABLE "Course" ALTER COLUMN "categoryId" SET NOT NULL;

-- DropColumn
ALTER TABLE "Course" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
