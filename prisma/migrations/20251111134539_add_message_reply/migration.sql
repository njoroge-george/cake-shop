-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "repliedBy" TEXT,
ADD COLUMN     "reply" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_repliedBy_fkey" FOREIGN KEY ("repliedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
