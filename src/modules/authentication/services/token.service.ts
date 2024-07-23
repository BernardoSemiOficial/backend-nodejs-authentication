import jwt from "jsonwebtoken";
import { TokenRepository } from "../repository/token.repository";
import { TokenDecoded, TokenPayload } from "../token.model";

export class TokenService {
  private SECRET_KEY = process.env.SECRET_KEY_TOKEN!;

  constructor(private tokenRepository: TokenRepository) {}

  generateTokenUser(
    user: TokenPayload,
    { isAccessToken }: { isAccessToken: boolean }
  ): string {
    if (isAccessToken) {
      try {
        const accessToken = this.generateToken(user, true);
        return accessToken;
      } catch (error) {
        throw new Error("Error generating token");
      }
    }
    return this.generateToken(user, false);
  }

  verifyToken(token: string): TokenDecoded {
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY);
      return decoded as TokenDecoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private generateToken(user: TokenPayload, isAccessToken: boolean): string {
    const expiration = {
      accessToken: "1m",
      refreshToken: "7d",
    };
    try {
      const token = jwt.sign(user, this.SECRET_KEY, {
        expiresIn: isAccessToken
          ? expiration.accessToken
          : expiration.refreshToken,
      });
      if (isAccessToken) {
        this.tokenRepository.create({
          userId: user.id,
          isRevoked: false,
          accessToken: token,
        });
      }
      return token;
    } catch (error) {
      throw new Error("Error generating token");
    }
  }
}
