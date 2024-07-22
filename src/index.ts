import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Router } from "express";
import { authenticationRouter } from "./modules/authentication/controller/authentication.controlller";
import { userRouter } from "./modules/users/controller/user.controller";

const app = express();
const route = Router();
const port = 3000;

app.use(express.json());

app.use(authenticationRouter);
app.use(userRouter);

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello world" });
});

app.use(route);
app.listen(port, () => `server running on port ${port}`);
