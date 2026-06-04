import { z } from "zod";

export const askAiSchema = z.object({
  knowledgeItemId: z.string(),
  question: z.string().min(3),
});