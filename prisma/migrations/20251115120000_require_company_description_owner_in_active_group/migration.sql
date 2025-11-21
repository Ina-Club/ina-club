-- Make comp-uuid (companyId), description, and createdById mandatory on ActiveGroup

-- Drop existing foreign keys that allow NULL on delete
ALTER TABLE "public"."ActiveGroup" DROP CONSTRAINT IF EXISTS "ActiveGroup_companyId_fkey";
ALTER TABLE "public"."ActiveGroup" DROP CONSTRAINT IF EXISTS "ActiveGroup_createdById_fkey";

-- Alter columns to be NOT NULL
ALTER TABLE "public"."ActiveGroup"
  ALTER COLUMN "description" SET NOT NULL,
  ALTER COLUMN "companyId" SET NOT NULL,
  ALTER COLUMN "createdById" SET NOT NULL;

-- Recreate foreign keys with RESTRICT semantics (no SET NULL)
ALTER TABLE "public"."ActiveGroup"
  ADD CONSTRAINT "ActiveGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."ActiveGroup"
  ADD CONSTRAINT "ActiveGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

