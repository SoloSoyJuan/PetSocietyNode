import { Router } from "express";
import { userController } from "../controllers";
import { auth, validateSchema } from "../middlewares";
import { userSchema, userUpdateSchema, userLoginSchema } from "../schemas";

export const userRouter = Router();

userRouter.get("/", userController.getAll);
userRouter.post("/", validateSchema(userSchema), userController.create);
userRouter.get("/:id", userController.getById);
userRouter.put("/:id", validateSchema(userUpdateSchema), userController.update);
userRouter.delete("/:id", userController.delete);

userRouter.post("/login", validateSchema(userLoginSchema), userController.login);
userRouter.post("/logout", userController.logout);