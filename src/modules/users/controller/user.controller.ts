import { Request, Response, Router } from "express";
import { userRepository } from "../../..";
import { AuthorizationMiddleware } from "../../authentication/middleware/authorization.middleware";

const userRouter = Router();

userRouter.get(
  "/users",
  AuthorizationMiddleware.verifyToken,
  (req: Request, res: Response) => {
    const users = userRepository.findAllUsers();
    res.json(users);
  }
);

export { userRouter };
