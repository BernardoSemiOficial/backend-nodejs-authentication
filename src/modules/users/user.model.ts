export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserInDatabase extends User {
  password: string;
}
