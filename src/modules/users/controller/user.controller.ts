import { Request, Response, Router } from "express";
import { UserRepository } from "../repository/user.repository";

const userRouter = Router();
const userRepository = new UserRepository();

userRouter.get("/users", (req: Request, res: Response) => {
  const users = userRepository.findAllUsers();
  res.json(users);
});

export { userRouter };
