export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}
