-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentsId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentsId_fkey" FOREIGN KEY ("parentsId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
