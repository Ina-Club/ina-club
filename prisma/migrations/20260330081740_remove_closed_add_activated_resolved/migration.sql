/*
  Warnings:

  - The values [CLOSED] on the enum `GroupStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GroupStatus_new" AS ENUM ('OPEN', 'ACTIVATED', 'RESOLVED', 'CANCELED', 'EXPIRED', 'PENDING', 'PREVIEW');
ALTER TABLE "ActiveGroup" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ActiveGroup" ALTER COLUMN "status" TYPE "GroupStatus_new" USING (
  CASE 
    WHEN "status"::text = 'CLOSED' THEN 'ACTIVATED'::text::"GroupStatus_new"
    ELSE "status"::text::"GroupStatus_new"
  END
);
ALTER TYPE "GroupStatus" RENAME TO "GroupStatus_old";
ALTER TYPE "GroupStatus_new" RENAME TO "GroupStatus";
DROP TYPE "GroupStatus_old";
ALTER TABLE "ActiveGroup" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
