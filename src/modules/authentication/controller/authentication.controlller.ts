import { AxiosError } from "axios";
import { randomUUID } from "crypto";
import { Response, Router } from "express";
import { tokenService, userService } from "../../..";
import { http } from "../../../http/axios";
import { UserGithub } from "../../../interfaces/github";
import {
  TypedRequestBody,
  TypedRequestQuery,
} from "../../../interfaces/request";
import {
  AuthGithubPayload,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
} from "../interfaces/authentication.interface";
import { BcriptService } from "../services/bcript.service";
import { TokenPayload } from "../token.model";

const authenticationRouter = Router();

authenticationRouter.post(
  "/api/auth/login",
  async (req: TypedRequestBody<LoginPayload>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const userInDatabase = userService.findUserByEmail(email);

    const isPasswordEqual = await BcriptService.compareHash(
      password,
      userInDatabase?.password ?? ""
    );

    if (!userInDatabase || !isPasswordEqual) {
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
  "/api/auth/register",
  async (req: TypedRequestBody<RegisterPayload>, res: Response) => {
    const { email, name, password } = req.body;
    const hashPassword = await BcriptService.generateHashPassword(password);
    const user = userService.createUser({
      id: randomUUID(),
      email,
      name,
      password: hashPassword,
    });
    res.json(user).status(201);
  }
);

authenticationRouter.post(
  "/api/auth/refresh-token",
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

authenticationRouter.post(
  "/api/auth/github",
  async (req: TypedRequestQuery<AuthGithubPayload>, res: Response) => {
    const { code } = req.query;
    let tokenGithub = null;

    try {
      tokenGithub = await http.post<{
        access_token: string;
        token_type: string;
        scode: string;
      }>("https://github.com/login/oauth/access_token", {
        client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_SECRET_KEY,
        code,
      });
    } catch (error) {
      return res.status(400).json({ message: "Intern error" });
    }

    if (!tokenGithub) {
      return res.status(401).json({ message: "Error to get token" });
    }

    const accessTokenGithub = tokenGithub.data.access_token;
    const tokenTypeGithub = tokenGithub.data.token_type;

    let userGithub = null;
    try {
      userGithub = await http.get<UserGithub>("https://api.github.com/user", {
        headers: {
          Accept: "application/json",
          Authorization: `${tokenTypeGithub} ${accessTokenGithub}`,
        },
      });
    } catch (error) {
      console.log((error as AxiosError).message);
      return res.status(400).json({ message: "Intern error" });
    }

    console.log(userGithub.data);

    if (!userGithub) {
      return res.status(401).json({ message: "Error to get token" });
    }

    const userInDatabase = userService.createUser({
      id: randomUUID(),
      email: userGithub.data.email ?? "no-email",
      name: userGithub.data.name,
      password: "github",
    });

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

    return res.json({ user: userGithub.data, accessToken, refreshToken });
  }
);

export { authenticationRouter };
