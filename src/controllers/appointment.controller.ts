import { Request, Response } from "express";
import { appointmentService } from "../services";
import { AppointmentInput, AppointmentUpdateInput } from "../interfaces";

class AppointmentController {

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const appointments = await appointmentService.getAll();
            res.status(200).json(appointments);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({ message: "No appointments found" });
                return;
            }
            res.status(500).json({ message: error });
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const appointment = await appointmentService.getById(id);
            res.status(200).json(appointment);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({ message: "Appointment not found" });
                return;
            }
            res.status(500).json({ message: error });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const newAppointment = await appointmentService.create(req.body as AppointmentInput);
            res.status(201).json(newAppointment);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: "Appointment already exists" });
                return;
            }
            res.status(500).json({ message: error });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const appointmentUpdated = await appointmentService.update(id, req.body as AppointmentUpdateInput);
            res.status(200).json(appointmentUpdated);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({ message: `Appointment with ${id} not found` });
                return;
            }
            res.status(500).json({ message: error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const appointmentDeleted = await appointmentService.delete(id);
            res.status(200).json(appointmentDeleted);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({ message: `Appointment with ${id} not found` });
                return;
            }
            res.status(500).json({ message: error });
        }
    }

}

export const appointmentController = new AppointmentController();