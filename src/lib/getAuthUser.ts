import { verifyToken } from "./auth";

export const getAuthUser = (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyToken(token);
};
