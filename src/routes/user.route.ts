import { Router } from "express";
import { userController } from "../controllers";
import { auth, validateSchema } from "../middlewares";
import { userSchema, userUpdateSchema, userLoginSchema } from "../schemas";

export const userRouter = Router();

userRouter.get("/", 
    auth(['Admin','Vet']), userController.getAll);
userRouter.post("/", 
    auth(['Admin']), 
    validateSchema(userSchema), userController.create);
userRouter.get("/:id", 
    auth(['Admin','Vet']), userController.getById);
userRouter.put("/:id", 
    auth(['Admin']), 
    validateSchema(userUpdateSchema), userController.update);
userRouter.delete("/:id", 
    auth(['Admin']), userController.delete);
userRouter.post("/login", 
    validateSchema(userLoginSchema), userController.login);
//userRouter.post("/logout", 
//    auth(['Admin','Vet','Owner']), userController.logout);