import { UserInDatabase } from "../user.model";

export class UserRepository {
  private users: UserInDatabase[] = [
    {
      id: 1,
      name: "user1",
      email: "user1@gmail.com",
      password: "password1",
    },
  ];
  create(user: UserInDatabase): void {
    if (!user) return;
    this.users.push(user);
  }
  findByEmail(email: string): UserInDatabase | undefined {
    return this.users.find((user) => user.email === email);
  }
  findById(id: number): UserInDatabase | undefined {
    return this.users.find((user) => user.id === id);
  }
  findAllUsers(): UserInDatabase[] {
    return this.users;
  }
}
