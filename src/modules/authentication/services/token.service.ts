import jwt from "jsonwebtoken";
import { User } from "../../users/user.model";
import { TokenRepository } from "../repository/token.repository";

export class TokenService {
  private SECRET_KEY = process.env.SECRET_KEY!;

  constructor(private tokenRepository: TokenRepository) {}

  generateTokenUser(
    user: User,
    { isAccessToken }: { isAccessToken: boolean }
  ): string {
    if (isAccessToken) {
      const accessToken = jwt.sign(user, this.SECRET_KEY, { expiresIn: "1m" });
      this.tokenRepository.create({
        userId: user.id,
        isRevoked: false,
        accessToken,
      });
      return accessToken;
    }
    return jwt.sign(user, this.SECRET_KEY, { expiresIn: "7d" });
  }
}
