import { Token } from "../token.model";

export class TokenRepository {
  private tokens: Token[] = [
    {
      userId: 1,
      accessToken: "",
      isRevoked: false,
    },
  ];
  create(token: Token): void {
    if (!token) return;
    this.tokens.push(token);
  }
  findTokenByUserId(userId: number) {
    return this.tokens.find((token) => token.userId === userId);
  }
}
