import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai";

export const askKnowledgeAI = async (
  userId: string,
  knowledgeItemId: string,
  question: string
) => {
  const knowledge = await prisma.knowledgeItem.findUnique({
    where: {
      id: knowledgeItemId,
    },
  });

  if (!knowledge) {
    throw new Error("Knowledge item not found");
  }

 

  const prompt = `You are a knowledge assistant.\n\nAnswer ONLY from the provided content.\nIf the answer is not present, say: \"I could not find that information in the selected knowledge.\"\n\nKnowledge:\nTitle: ${knowledge.title}\n\nContent:\n${knowledge.content}\n\nQuestion:\n${question}`;

  const response = await getOpenAI().responses.create({
    // model: "gpt-4.1-mini",
    model: "llama-3.1-8b-instant",
    input: prompt,
  });

  const answer =
    (response as any).output_text ||
    Array.isArray((response as any).output)
      ? (response as any).output
          .flatMap((item: any) => item.content || [])
          .map((chunk: any) => chunk.text || "")
          .join("")
      : "";

  const conversation = await prisma.conversation.create({
    data: {
      userId,
      knowledgeItemId,
      question,
      answer,
      modelUsed: "gpt-4.1-mini",
      tokensUsed:
        (response as any).usage?.total_tokens ?? undefined,
    },
  });

  return {
    answer,
    conversation,
  };
};