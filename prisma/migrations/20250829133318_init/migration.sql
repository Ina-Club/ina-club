-- CreateTable
CREATE TABLE "public"."RequestGroup" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "categoryId" TEXT,
    "title" TEXT NOT NULL,

    CONSTRAINT "RequestGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActiveGroup" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "numberOfParticipants" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "requestGroupId" TEXT,
    "companyId" TEXT,

    CONSTRAINT "ActiveGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_RequestGroupParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RequestGroupParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ActiveGroupParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActiveGroupParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_CompanyCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "public"."User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "_RequestGroupParticipants_B_index" ON "public"."_RequestGroupParticipants"("B");

-- CreateIndex
CREATE INDEX "_ActiveGroupParticipants_B_index" ON "public"."_ActiveGroupParticipants"("B");

-- CreateIndex
CREATE INDEX "_CompanyCategories_B_index" ON "public"."_CompanyCategories"("B");

-- AddForeignKey
ALTER TABLE "public"."RequestGroup" ADD CONSTRAINT "RequestGroup_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroup" ADD CONSTRAINT "ActiveGroup_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroup" ADD CONSTRAINT "ActiveGroup_requestGroupId_fkey" FOREIGN KEY ("requestGroupId") REFERENCES "public"."RequestGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroup" ADD CONSTRAINT "ActiveGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RequestGroupParticipants" ADD CONSTRAINT "_RequestGroupParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."RequestGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RequestGroupParticipants" ADD CONSTRAINT "_RequestGroupParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ActiveGroupParticipants" ADD CONSTRAINT "_ActiveGroupParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ActiveGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ActiveGroupParticipants" ADD CONSTRAINT "_ActiveGroupParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyCategories" ADD CONSTRAINT "_CompanyCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyCategories" ADD CONSTRAINT "_CompanyCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
