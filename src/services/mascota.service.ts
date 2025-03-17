// services/mascota.service.ts

import { MascotaModel, MascotaDocument } from "../models";
import { MascotaInput, MascotaInputUpdate } from "../interfaces";

class MascotaService {
  // GET ALL
  public async getAll(): Promise<MascotaDocument[]> {
    try {
      const mascotas = await MascotaModel.find();
      if (!mascotas) {
        throw new ReferenceError("No mascotas found");
      }
      return mascotas;
    } catch (error) {
      throw error;
    }
  }

  // GET BY ID
  public async getById(id: string): Promise<MascotaDocument | null> {
    try {
      const mascota = await MascotaModel.findById(id);
      return mascota;
    } catch (error) {
      throw error;
    }
  }

  // CREATE
  public async create(mascotaInput: MascotaInput): Promise<MascotaDocument> {
    try {
      // Optional: check if a Mascota with the same name already exists
      // e.g., const existing = await MascotaModel.findOne({ name: mascotaInput.name });
      // if (existing) throw new ReferenceError("Mascota already exists");

      const mascota = await MascotaModel.create(mascotaInput);
      return mascota;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  public async update(
    id: string,
    mascotaInput: MascotaInputUpdate
  ): Promise<MascotaDocument | null> {
    try {
      // Make sure the Mascota exists first
      const mascota = await this.getById(id);
      if (!mascota) {
        throw new ReferenceError("Mascota not found");
      }

      // Perform the update
      const updatedMascota = await MascotaModel.findByIdAndUpdate(
        id,
        mascotaInput,
        { new: true } // return the updated doc
      );
      return updatedMascota;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  public async delete(id: string): Promise<MascotaDocument | null> {
    try {
      const mascota = await this.getById(id);
      if (!mascota) {
        throw new ReferenceError("Mascota not found");
      }

      const deletedMascota = await MascotaModel.findByIdAndDelete(id);
      return deletedMascota;
    } catch (error) {
      throw error;
    }
  }
}

export const mascotaService = new MascotaService();
