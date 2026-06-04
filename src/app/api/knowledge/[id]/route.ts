import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { knowledgeSchema } from "@/validations/knowledge.schema";
import {
  getKnowledgeItemById,
  updateKnowledgeItem,
  deleteKnowledgeItem,
} from "@/services/knowledge.service";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    const { id } = await params;

    const item = await getKnowledgeItemById(id, user.id);

    if (!item) {
      return errorResponse("Knowledge item not found", 404);
    }

    if (item.userId !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    await delay(3000);
    return successResponse(item);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    const { id } = await params;

    const existing = await prisma.knowledgeItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Not found", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    const body = await req.json();
    const validatedData = knowledgeSchema.parse(body);

    const updated = await updateKnowledgeItem(id, user.id, {
      title: validatedData.title,
      content: validatedData.content,
      tags: validatedData.tags,
      fileUrl: validatedData.fileUrl,
    });

    await delay(3000);
    return successResponse(updated, "Knowledge item updated");
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    const { id } = await params;

    const existing = await prisma.knowledgeItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Not found", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    await deleteKnowledgeItem(id, user.id);

    await delay(3000);
    return successResponse(null, "Knowledge item deleted");
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
