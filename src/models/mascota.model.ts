// models/mascota.model.ts
import mongoose from "mongoose";
import { MascotaInput } from "../interfaces";

/**
 * Extend mongoose.Document so that each Mascota document
 * automatically has `_id`, `createdAt`, `updatedAt`, etc.
 */
export interface MascotaDocument extends MascotaInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  // If you also want deleteAt, add it here
  // deletedAt: Date;
}

const mascotaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    // add more fields as needed
  },
  {
    timestamps: true,       // Adds createdAt, updatedAt
    collection: "mascotas", // Name of the collection in MongoDB
  }
);

export const MascotaModel = mongoose.model<MascotaDocument>("Mascota", mascotaSchema);
