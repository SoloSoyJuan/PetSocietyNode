import { Router } from "express";
import { appointmentController } from "../controllers";
import { validateAppointmentSchema } from "../middlewares";
import { AppointmentSchema, AppointmentUpdateSchema } from "../schemas";

export const appointmentRouter = Router();

appointmentRouter.get("/", appointmentController.getAll);
appointmentRouter.post("/", validateAppointmentSchema(AppointmentSchema), appointmentController.create);
appointmentRouter.get("/:id", appointmentController.getById);
appointmentRouter.put("/:id", validateAppointmentSchema(AppointmentUpdateSchema), appointmentController.update);
appointmentRouter.delete("/:id", appointmentController.delete);