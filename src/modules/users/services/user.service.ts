import { TokenService } from "../../authentication/services/token.service";
import { UserRepository } from "../repository/user.repository";
import { User } from "../user.model";

export class UserService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository
  ) {}

  generateToken(user: User, { isAccessToken }: { isAccessToken: boolean }) {
    return this.tokenService.generateTokenUser(user, { isAccessToken });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
