/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `WishItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WishItem_text_key" ON "WishItem"("text");
