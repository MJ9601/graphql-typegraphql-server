import jwt from "jsonwebtoken";
import config from "config";

const privateKey = Buffer.from(
  config.get<string>("privateKey"),
  "base64"
).toString("ascii");
const publicKey = Buffer.from(
  config.get<string>("publicKey"),
  "base64"
).toString("ascii");

export const signJwt = (payload: Object, options?: jwt.SignOptions) =>
  jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });

export const verifyJwt = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, publicKey) as T;
  } catch (err: any) {
    return null;
  }
};
