import { z } from "zod";

export const knowledgeSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(4),
  tags: z.array(z.string()).optional(),
  fileUrl: z.string().optional(),
});