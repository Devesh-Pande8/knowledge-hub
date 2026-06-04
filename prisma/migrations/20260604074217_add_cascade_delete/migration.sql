-- DropForeignKey
ALTER TABLE "KnowledgeTag" DROP CONSTRAINT "KnowledgeTag_knowledgeItemId_fkey";

-- AddForeignKey
ALTER TABLE "KnowledgeTag" ADD CONSTRAINT "KnowledgeTag_knowledgeItemId_fkey" FOREIGN KEY ("knowledgeItemId") REFERENCES "KnowledgeItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
