import { UserInDatabase } from "../user.model";

export class UserRepository {
  private users: UserInDatabase[] = [];

  create(user: UserInDatabase): UserInDatabase | undefined {
    if (!user) return;
    this.users.push(user);
    console.log({ users: this.users });
    return user;
  }
  findByEmail(email: string): UserInDatabase | undefined {
    return this.users.find((user) => user.email === email);
  }
  findById(id: string): UserInDatabase | undefined {
    return this.users.find((user) => user.id === id);
  }
  findAllUsers(): UserInDatabase[] {
    return this.users;
  }
}
