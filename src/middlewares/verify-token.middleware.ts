import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY_TOKEN!;
console.log("SECRET_KEY", SECRET_KEY);

export function verifyTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenWithBearer = req.headers.authorization;
  if (!tokenWithBearer) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = tokenWithBearer.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (error, tokenDecoded) => {
    if (error) return res.status(403).json({ message: "Invalid token" });
    console.log("tokenDecoded", tokenDecoded);
    // req.user = tokenDecoded;
    next();
  });
}
