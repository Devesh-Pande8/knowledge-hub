import { loginSchema } from "@/validations/auth.schema";
import { loginUser } from "@/services/auth.service";
import {
  errorResponse,
  successResponse,
} from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData =
      loginSchema.parse(body);

    const result = await loginUser(
      validatedData.email,
      validatedData.password
    );

    return successResponse(
      result,
      "Login successful"
    );
  } catch (error: any) {
   return errorResponse(
    error?.issues?.[0]?.message || error.message,
    400
  );
}
}