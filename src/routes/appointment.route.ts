import { Router } from "express";
import { appointmentController } from "../controllers";
import { validateSchema } from "../middlewares";
import { AppointmentSchema, AppointmentUpdateSchema } from "../schemas";

export const appointmentRouter = Router();

appointmentRouter.get("/", appointmentController.getAll);
appointmentRouter.post("/", validateSchema(AppointmentSchema), appointmentController.create);
appointmentRouter.get("/:id", appointmentController.getById);
appointmentRouter.put("/:id", validateSchema(AppointmentUpdateSchema), appointmentController.update);
appointmentRouter.delete("/:id", appointmentController.delete);