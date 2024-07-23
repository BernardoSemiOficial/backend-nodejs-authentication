export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserInDatabase extends User {
  password: string;
}
