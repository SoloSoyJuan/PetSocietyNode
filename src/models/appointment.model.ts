import mongoose from "mongoose";
import { AppointmentInput } from "../interfaces";

export interface AppointmentDocument extends AppointmentInput, mongoose.Document{
    createdAt: Date,
    updateAt: Date,
    deleteAt: Date
}

const appointmentSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    time: {type: String, required: true},
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'pets', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{timestamps:true, collection:"appointments"});

export const appointmentModel = mongoose.model<AppointmentDocument>("Appointments", appointmentSchema);