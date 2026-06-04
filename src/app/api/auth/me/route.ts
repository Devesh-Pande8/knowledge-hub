import { getAuthUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
} from "@/utils/apiResponse";

export async function GET(req: Request) {
  try {
    const auth = getAuthUser(req);

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error: any) {
    console.error("Auth error:", error.message);
    return errorResponse(error.message || "Unauthorized", 401);
  }
}
