import { prisma } from "@/lib/prisma";

export const getConversations = async (
  userId: string,
  knowledgeItemId?: string
) => {
  return prisma.conversation.findMany({
    where: {
      userId,
      ...(knowledgeItemId && { knowledgeItemId }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
