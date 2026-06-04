import {
  createKnowledgeItem,
  getKnowledgeItems,
} from "@/services/knowledge.service";

import { getAuthUser } from "@/lib/getAuthUser";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { knowledgeSchema } from "@/validations/knowledge.schema";

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const user = getAuthUser(req);

    const body = await req.json();
    const validatedData = knowledgeSchema.parse(body);

    const knowledge = await createKnowledgeItem({
      ...validatedData,
      userId: user.id,
    });

    await delay(3000);

    return successResponse(knowledge, "Knowledge item created", 201);
  } catch (error: any) {
    console.error("POST knowledge error:", error.message);
    return errorResponse(error.message || "Failed to create knowledge", 400);
  }
}

export async function GET(req: Request) {
  try {
    const user = getAuthUser(req);
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    const items = await getKnowledgeItems({
      userId: user.id,
      page,
      limit,
      search,
      tag,
    });

    await delay(3000);

    return successResponse(items);
  } catch (error: any) {
    console.error("GET knowledge error:", error.message);
    return errorResponse(error.message || "Failed to fetch knowledge", 401);
  }
}