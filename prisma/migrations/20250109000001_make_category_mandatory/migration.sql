-- Make categoryId mandatory for RequestGroup
-- First, update any existing records with null categoryId to have a default category
-- You'll need to replace 'default-category-id' with an actual category ID from your database
UPDATE "RequestGroup" SET "categoryId" = 'default-category-id' WHERE "categoryId" IS NULL;

-- Make categoryId NOT NULL for RequestGroup
ALTER TABLE "RequestGroup" ALTER COLUMN "categoryId" SET NOT NULL;

-- Make categoryId mandatory for ActiveGroup
-- First, update any existing records with null categoryId to have a default category
-- You'll need to replace 'default-category-id' with an actual category ID from your database
UPDATE "ActiveGroup" SET "categoryId" = 'default-category-id' WHERE "categoryId" IS NULL;

-- Make categoryId NOT NULL for ActiveGroup
ALTER TABLE "ActiveGroup" ALTER COLUMN "categoryId" SET NOT NULL;
