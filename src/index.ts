import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Router } from "express";
import { generateTokenUser } from "./helpers/generate-token-user";
import { TypedRequestBody } from "./interfaces/request";
import { verifyTokenMiddleware } from "./middlewares/verify-token.middleware";
import { users } from "./mocks/users";

const app = express();
const route = Router();
const port = 3000;

interface LoginPayload {
  email: string;
  password: string;
}

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello world" });
});

route.post("/login", (req: TypedRequestBody<LoginPayload>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userInDatabase = users.find((user) => user.email === email);
  const incorrectPassword = userInDatabase?.password !== password;

  if (!userInDatabase || incorrectPassword) {
    return res.status(401).json({ message: "Email or password are wrong" });
  }

  const accessToken = generateTokenUser(
    {
      email,
      id: userInDatabase?.id,
      name: userInDatabase.name,
      role: userInDatabase?.role,
    },
    { isAccessToken: true }
  );
  const refreshToken = generateTokenUser(
    {
      email,
      id: userInDatabase?.id,
      name: userInDatabase.name,
      role: userInDatabase?.role,
    },
    { isAccessToken: false }
  );

  res.json({ accessToken, refreshToken });
});

route.get("/users", verifyTokenMiddleware, (req: Request, res: Response) => {
  res.json(users);
});

app.use(route);
app.listen(port, () => `server running on port ${port}`);
