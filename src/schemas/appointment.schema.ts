import {object, string} from 'zod';

export const AppointmentSchema = object({
    date: string({required_error: "Date is required"})
                .date(),
    time: string({required_error: "Time is required"})
                .time({precision: 0}),
    doctorId: string({required_error: "Doctor ID is required"}),
    petId: string({required_error: "Pet ID is required"}),
    ownerId: string({required_error: "Owner ID is required"})
}).strict();

export const AppointmentUpdateSchema = object({
    date: string({required_error: "Date is required"})
                .date(),
    time: string({required_error: "Time is required"})
                .time({precision: 0}),
    doctorId: string({required_error: "Doctor ID is required"}),
    petId: string({required_error: "Pet ID is required"}),
    ownerId: string({required_error: "Owner ID is required"})
}).strict();
