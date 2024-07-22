export interface TokenPayload {
  id: number;
  email: string;
}

export interface Token {
  userId: number;
  accessToken: string;
  isRevoked: boolean;
}
