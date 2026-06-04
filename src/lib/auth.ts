import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

export const generateToken = (
  payload: JwtPayload
) => {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (
  token: string
): JwtPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
};