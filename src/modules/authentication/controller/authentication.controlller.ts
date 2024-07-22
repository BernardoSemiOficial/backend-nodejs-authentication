import { Response, Router } from "express";
import { TypedRequestBody } from "../../../interfaces/request";
import { UserService } from "../../users/services/user.service";
import { LoginPayload } from "../interfaces/login.interface";
import { TokenRepository } from "../repository/token.repository";

import { UserRepository } from "../../users/repository/user.repository";
import { TokenService } from "../services/token.service";

const authenticationRouter = Router();
const userService = new UserService(
  new TokenService(new TokenRepository()),
  new UserRepository()
);
const tokenRepository = new TokenRepository();

authenticationRouter.post(
  "/login",
  (req: TypedRequestBody<LoginPayload>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const userInDatabase = userService.findUserByEmail(email);
    const incorrectPassword = userInDatabase?.password !== password;

    if (!userInDatabase || incorrectPassword) {
      return res.status(401).json({ message: "Email or password are wrong" });
    }

    const accessToken = userService.generateToken(
      {
        email,
        id: userInDatabase?.id,
        name: userInDatabase.name,
      },
      { isAccessToken: true }
    );
    const refreshToken = userService.generateToken(
      {
        email,
        id: userInDatabase?.id,
        name: userInDatabase.name,
      },
      { isAccessToken: false }
    );

    res.json({ accessToken, refreshToken });
  }
);

export { authenticationRouter };
