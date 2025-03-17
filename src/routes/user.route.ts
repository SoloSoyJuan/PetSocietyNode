import { Router } from "express";
import { userController } from "../controllers";

export const userRouter = Router();

userRouter.get("/", userController.getAll);
userRouter.post("/", userController.create);
userRouter.get("/:id", userController.getById);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id", userController.delete);

userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);