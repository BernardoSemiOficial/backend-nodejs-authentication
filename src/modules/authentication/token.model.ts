import { JwtPayload } from "jsonwebtoken";
import { AuthenticationProvider } from "../users/user.model";

export interface TokenPayload {
  id: string;
  email: string;
  provider: AuthenticationProvider | null;
}

export interface Token {
  userId: string;
  accessToken: string;
  isRevoked: boolean;
}

export interface TokenDecoded extends TokenPayload, JwtPayload {}
