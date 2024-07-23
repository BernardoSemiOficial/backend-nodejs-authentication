import { randomUUID } from "crypto";
import { Response, Router } from "express";
import { tokenService, userService } from "../../..";
import { TypedRequestBody } from "../../../interfaces/request";
import {
  LoginPayload,
  RefreshTokenPayload,
  UserCreatePayload,
} from "../interfaces/authentication.interface";
import { TokenPayload } from "../token.model";

const authenticationRouter = Router();

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

    const tokenPayload: TokenPayload = {
      id: userInDatabase.id,
      email: userInDatabase.email,
    };
    const accessToken = userService.generateToken(tokenPayload, {
      isAccessToken: true,
    });
    const refreshToken = userService.generateToken(tokenPayload, {
      isAccessToken: false,
    });

    res.json({ accessToken, refreshToken });
  }
);

authenticationRouter.post(
  "/register",
  (req: TypedRequestBody<UserCreatePayload>, res: Response) => {
    const { email, name, password } = req.body;
    const user = userService.createUser({
      id: randomUUID(),
      email,
      name,
      password,
    });
    res.json(user).status(201);
  }
);

authenticationRouter.post(
  "/refresh-token",
  (req: TypedRequestBody<RefreshTokenPayload>, res: Response) => {
    const { refreshToken } = req.body;
    const tokenDecoded = tokenService.verifyToken(refreshToken);
    const userId = tokenDecoded.id;
    const userInDatabase = userService.findUserById(userId);

    if (!userInDatabase) {
      return res.status(404).json({ message: "Cannot generate a new token" });
    }
    const tokenPayload: TokenPayload = {
      id: userInDatabase.id,
      email: userInDatabase.email,
    };
    const accessToken = userService.generateToken(tokenPayload, {
      isAccessToken: true,
    });
    res.json({ accessToken }).status(201);
  }
);

export { authenticationRouter };
