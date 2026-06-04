import { registerSchema } from "@/validations/auth.schema";
import { registerUser } from "@/services/auth.service";
import {
  successResponse,
  errorResponse,
} from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    const user = await registerUser(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    return successResponse(user, "Registration successful", 201);
  } catch (error: any) {
    return errorResponse(
    error?.issues?.[0]?.message || error.message,
    400
  );
  }
}
