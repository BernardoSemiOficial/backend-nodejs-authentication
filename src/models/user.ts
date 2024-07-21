interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserInDatabase extends User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}
