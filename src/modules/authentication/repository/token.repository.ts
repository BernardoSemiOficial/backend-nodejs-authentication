import { Token } from "../token.model";

export class TokenRepository {
  private tokens: Token[] = [];

  create(token: Token): void {
    if (!token) return;
    this.tokens.push(token);
    console.log({ tokens: this.tokens });
  }
  findTokenByUserId(userId: string) {
    return this.tokens.find((token) => token.userId === userId);
  }
}
