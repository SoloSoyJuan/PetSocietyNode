import { Router } from "express";
import { appointmentController } from "../controllers";
import { auth, validateSchema } from "../middlewares";
import { AppointmentSchema, AppointmentUpdateSchema } from "../schemas";

export const appointmentRouter = Router();

appointmentRouter.get("/", 
    auth(['Admin','Vet','Owner']), appointmentController.getAll);
appointmentRouter.post("/", 
    auth(['Admin','Vet','Owner']), 
    validateSchema(AppointmentSchema), appointmentController.create);
appointmentRouter.get("/:id", 
    auth(['Admin','Vet','Owner']), appointmentController.getById);
appointmentRouter.put("/:id", 
    auth(['Admin','Vet']), 
    validateSchema(AppointmentUpdateSchema), appointmentController.update);
appointmentRouter.delete("/:id", 
    auth(['Admin']), appointmentController.delete);