import { appointmentModel, AppointmentDocument } from "../models";
import { AppointmentInput, AppointmentUpdateInput } from "../interfaces";

class AppointmentService {

    public async getAll(): Promise<AppointmentDocument[]> {
        try {
            const appointments = await appointmentModel.find();
            if (!appointments) {
                throw new ReferenceError("No appointments found");
            }
            return appointments;
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: string): Promise<AppointmentDocument | null> {
        try {
            const appointment = await appointmentModel.findById(id);
            if (!appointment) {
                throw new ReferenceError("Appointment not found");
            }
            return appointment;
        } catch (error) {
            throw error;
        }
    }

    public async create(appointmentInput: AppointmentInput): Promise<AppointmentDocument> {
        try {
            
            const appointmentExists: AppointmentDocument | null = await appointmentModel.findOne({
                date: appointmentInput.date,
                time: appointmentInput.time
            });
            if (appointmentExists !== null) {
                throw new ReferenceError("Appointment already exists at the same date and time");
            }

            const appointment = await appointmentModel.create(appointmentInput);
            return appointment;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: string, appointmentInput: AppointmentUpdateInput): Promise<AppointmentDocument | null> {
        try {
            const appointment = await this.getById(id);
            if (!appointment) {
                throw new ReferenceError("Appointment not found");
            }

            const updatedAppointment = await appointmentModel.findByIdAndUpdate(id, appointmentInput, { new: true });
            return updatedAppointment;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<AppointmentDocument | null> {
        try {
            const appointment = await this.getById(id);
            if (!appointment) {
                throw new ReferenceError("Appointment not found");
            }

            const deletedAppointment = await appointmentModel.findByIdAndDelete(id);
            return deletedAppointment;
        } catch (error) {
            throw error;
        }
    }

    public async getByPetId(petId: string): Promise<AppointmentDocument[]> {
        try {
            const appointments = await appointmentModel.find({ pet: petId });
            if (!appointments) {
                throw new ReferenceError("No appointments found");
            }
            return appointments;
        } catch (error) {
            throw error;
        }
    }

    public async getByUserId(userId: string): Promise<AppointmentDocument[]> {
        try {
            const appointments = await appointmentModel.find({ user: userId });
            if (!appointments) {
                throw new ReferenceError("No appointments found");
            }
            return appointments;
        } catch (error) {
            throw error;
        }
    }

}

export const appointmentService = new AppointmentService();