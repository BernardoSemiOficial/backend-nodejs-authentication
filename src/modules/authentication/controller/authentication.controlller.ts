import { AxiosError } from "axios";
import { randomUUID } from "crypto";
import { Response, Router } from "express";
import { google } from "googleapis";
import { z } from "zod";
import { tokenService, userService } from "../../..";
import { oauth2Client } from "../../../auth/google";
import { http } from "../../../http/axios";
import { UserGithub } from "../../../interfaces/github";
import {
  TypedRequestBody,
  TypedRequestQuery,
} from "../../../interfaces/request";
import { AuthenticationProvider, UserResponse } from "../../users/user.model";
import {
  AuthGithubPayload,
  AuthGooglePayload,
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
      provider: null,
    };
    const accessToken = userService.generateToken(tokenPayload, {
      isAccessToken: true,
    });
    const refreshToken = userService.generateToken(tokenPayload, {
      isAccessToken: false,
    });

    res
      .json({
        accessToken,
        refreshToken,
        user: new UserResponse(userInDatabase, null),
      })
      .status(200);
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
      provider: null,
      idProvider: null,
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
      provider: userInDatabase.provider,
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

    if (!userGithub) {
      return res.status(401).json({ message: "Error to get token" });
    }

    console.log(userGithub.data);

    const userEmail = z.string().parse(userGithub.data.email);

    const userInDatabase = userService.findUserByEmail(userEmail);

    if (userInDatabase) {
      const tokenPayload: TokenPayload = {
        id: userInDatabase.id,
        email: userInDatabase.email,
        provider: userInDatabase.provider,
      };
      const accessToken = userService.generateToken(tokenPayload, {
        isAccessToken: true,
      });
      const refreshToken = userService.generateToken(tokenPayload, {
        isAccessToken: false,
      });

      return res.json({
        user: new UserResponse(userInDatabase, { github: userGithub.data }),
        accessToken,
        refreshToken,
      });
    }

    const user = z
      .object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
        idProvider: z.coerce.string(),
        provider: z.nativeEnum(AuthenticationProvider),
        password: z.string().nullable(),
      })
      .parse({
        id: randomUUID(),
        email: userGithub.data.email,
        name: userGithub.data.name,
        provider: AuthenticationProvider.GITHUB,
        idProvider: userGithub.data.id,
        password: null,
      });

    const userCreateInDatabase = userService.createUser(user);

    const tokenPayload: TokenPayload = {
      id: userCreateInDatabase.id,
      email: userCreateInDatabase.email,
      provider: userCreateInDatabase.provider,
    };
    const accessToken = userService.generateToken(tokenPayload, {
      isAccessToken: true,
    });
    const refreshToken = userService.generateToken(tokenPayload, {
      isAccessToken: false,
    });

    return res.json({
      user: new UserResponse(userCreateInDatabase, { github: userGithub.data }),
      accessToken,
      refreshToken,
    });
  }
);

authenticationRouter.get("/api/auth/google", (req, res: Response) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  res.json({ url: authUrl });
});

// Extend the Session interface to include the user property
declare module "express-session" {
  interface Session {
    user: any;
  }
}

// Callback para o Google OAuth2
authenticationRouter.post(
  "/api/auth/google",
  async (req: TypedRequestQuery<AuthGooglePayload>, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const userGoogle = await oauth2.userinfo.get();
    req.session.user = userGoogle.data;

    console.log(userGoogle);

    const userEmail = z.string().parse(userGoogle.data.email);

    const userInDatabase = userService.findUserByEmail(userEmail);

    if (userInDatabase) {
      const tokenPayload: TokenPayload = {
        id: userInDatabase.id,
        email: userInDatabase.email,
        provider: userInDatabase.provider,
      };
      const accessToken = userService.generateToken(tokenPayload, {
        isAccessToken: true,
      });
      const refreshToken = userService.generateToken(tokenPayload, {
        isAccessToken: false,
      });

      return res.json({
        user: new UserResponse(userInDatabase, { google: userGoogle.data }),
        accessToken,
        refreshToken,
      });
    }

    const user = z
      .object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
        idProvider: z.string(),
        provider: z.nativeEnum(AuthenticationProvider),
        password: z.string().nullable(),
      })
      .parse({
        id: randomUUID(),
        email: userGoogle.data.email,
        name: userGoogle.data.name,
        provider: AuthenticationProvider.GOOGLE,
        idProvider: userGoogle.data.id,
        password: null,
      });

    const userCreateInDatabase = userService.createUser(user);

    const tokenPayload: TokenPayload = {
      id: userCreateInDatabase.id,
      email: userCreateInDatabase.email,
      provider: userCreateInDatabase.provider,
    };
    const accessToken = userService.generateToken(tokenPayload, {
      isAccessToken: true,
    });
    const refreshToken = userService.generateToken(tokenPayload, {
      isAccessToken: false,
    });

    return res.json({
      user: new UserResponse(userCreateInDatabase, { google: userGoogle.data }),
      accessToken,
      refreshToken,
    });
  }
);

export { authenticationRouter };
