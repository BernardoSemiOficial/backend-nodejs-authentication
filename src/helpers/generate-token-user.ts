import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY_TOKEN!;

export function generateTokenUser(
  user: User,
  { isAccessToken }: { isAccessToken: boolean }
): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  if (isAccessToken) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1m" });
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}
