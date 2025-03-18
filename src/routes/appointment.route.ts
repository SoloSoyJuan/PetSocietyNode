import { Router } from "express";
import { appointmentController } from "../controllers";

export const appointmentRouter = Router();

appointmentRouter.get("/", appointmentController.getAll);
appointmentRouter.post("/", appointmentController.create);
appointmentRouter.get("/:id", appointmentController.getById);
appointmentRouter.put("/:id", appointmentController.update);
appointmentRouter.delete("/:id", appointmentController.delete);