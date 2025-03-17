import mongoose from "mongoose";
import { petsInput } from "../interfaces";

export interface petsDocument extends petsInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const petsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },     // Nueva propiedad
    size: { type: String, required: true },      // Nueva propiedad
    age: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Relación con el dueño
  },
  {
    timestamps: true,
    collection: "pets",
  }
);

export const petsModel = mongoose.model<petsDocument>(
  "pets",
  petsSchema
);
