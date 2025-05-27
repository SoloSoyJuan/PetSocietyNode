import { AppointmentInput, AppointmentUpdateInput } from "../interfaces";
import { appointmentService } from "../services";
import { AppointmentDocument } from "../models";

export const appointmentResolvers = {
  Query: {
    appointments: async () => {
      return await appointmentService.getAll();
    },
    appointment: async (_root: any, params: any) => {
      const appointment: AppointmentDocument | null = await appointmentService.getById(params.id);
      return appointment;
    },
  },
  Mutation: {
    createAppointment: async (_root: any, params: any) => {
        const appointment: AppointmentDocument | null = await appointmentService.create(params.input as AppointmentInput);
        if (!appointment) throw new Error("Error creating appointment");
        return await appointment;
    },
    updateAppointment: async (_root: any, params: any) => {
      const appointment: AppointmentDocument | null = await appointmentService.update(params.id, params.input as AppointmentUpdateInput);
      if (!appointment) throw new Error("Appointment not found");
      return appointment;
    },
    deleteAppointment: async (_root: any, params: any) => {
      return await appointmentService.delete(params.id);
    },
  },
};
