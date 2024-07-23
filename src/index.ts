import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Router } from "express";
import { authenticationRouter } from "./modules/authentication/controller/authentication.controlller";
import { TokenRepository } from "./modules/authentication/repository/token.repository";
import { TokenService } from "./modules/authentication/services/token.service";
import { userRouter } from "./modules/users/controller/user.controller";
import { UserRepository } from "./modules/users/repository/user.repository";
import { UserService } from "./modules/users/services/user.service";

const app = express();
const route = Router();
const port = 3000;

app.use(express.json());

export const tokenRepository = new TokenRepository();
export const tokenService = new TokenService(tokenRepository);
export const userRepository = new UserRepository();
export const userService = new UserService(tokenService, userRepository);

app.use(authenticationRouter);
app.use(userRouter);

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello world" });
});

app.use(route);
app.listen(port, () => `server running on port ${port}`);
