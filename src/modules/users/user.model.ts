export interface User {
  id: string;
  name: string;
  email: string;
  provider: AuthenticationProvider | null;
  idProvider: string | null;
}

export enum AuthenticationProvider {
  GITHUB = "github",
  GOOGLE = "google",
}

export interface UserInDatabase extends User {
  password: string | null;
}

export class UserResponse {
  id: string;
  name: string;
  email: string;
  provider: AuthenticationProvider | null;
  idProvider: string | null;
  infoProvider: {
    github?: any;
    google?: any;
  } | null;

  constructor(user: User, infoProvider: { github?: any; google?: any } | null) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.provider = user.provider;
    this.idProvider = user.idProvider;
    this.infoProvider = infoProvider;
  }
}
