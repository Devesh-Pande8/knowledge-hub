import { askAiSchema } from "@/validations/ai.schema";
import { askKnowledgeAI } from "@/services/ai.service";
import { getAuthUser } from "@/lib/getAuthUser";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const user = getAuthUser(req);
    const body = await req.json();

    const validatedData = askAiSchema.parse(body);

    const result = await askKnowledgeAI(
      user.id,
      validatedData.knowledgeItemId,
      validatedData.question
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
