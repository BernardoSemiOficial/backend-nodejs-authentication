import { TokenService } from "../../authentication/services/token.service";
import { TokenPayload } from "../../authentication/token.model";
import { UserRepository } from "../repository/user.repository";
import { UserInDatabase } from "../user.model";

export class UserService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository
  ) {}

  generateToken(
    user: TokenPayload,
    { isAccessToken }: { isAccessToken: boolean }
  ) {
    return this.tokenService.generateTokenUser(user, { isAccessToken });
  }

  findUserById(id: string) {
    return this.userRepository.findById(id);
  }

  findUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  createUser(user: UserInDatabase) {
    return this.userRepository.create(user);
  }
}
