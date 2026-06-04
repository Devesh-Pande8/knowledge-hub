import cloudinary from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const body = await req.formData();

    const file = body.get("file") as File;

    if (!file) {
      return errorResponse("No file uploaded");
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
