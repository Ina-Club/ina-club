-- Require description and createdById on RequestGroup

-- Drop existing foreign key that allowed NULL values
ALTER TABLE "public"."RequestGroup"
  DROP CONSTRAINT IF EXISTS "RequestGroup_createdById_fkey";

-- Enforce NOT NULL in the schema
ALTER TABLE "public"."RequestGroup"
  ALTER COLUMN "description" SET NOT NULL,
  ALTER COLUMN "createdById" SET NOT NULL;

-- Recreate the foreign key with RESTRICT semantics on delete
ALTER TABLE "public"."RequestGroup"
  ADD CONSTRAINT "RequestGroup_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "public"."User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
