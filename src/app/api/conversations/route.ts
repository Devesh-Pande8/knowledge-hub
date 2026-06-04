import { getAuthUser } from "@/lib/getAuthUser";
import { getConversations } from "@/services/conversation.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(req: Request) {
  try {
    const user = getAuthUser(req);
    const url = new URL(req.url);
    const knowledgeItemId = url.searchParams.get("knowledgeItemId") || undefined;

    const conversations = await getConversations(
      user.id,
      knowledgeItemId
    );

    return successResponse(conversations);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
