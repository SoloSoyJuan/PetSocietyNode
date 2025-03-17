// services/pets.service.ts

import { petsModel, petsDocument } from "../models";
import { petsInput, petsInputUpdate } from "../interfaces";

class PetsService {
  // GET ALL
  public async getAll(): Promise<petsDocument[]> {
    try {
      const petss = await petsModel.find();
      if (!petss) {
        throw new ReferenceError("No petss found");
      }
      return petss;
    } catch (error) {
      throw error;
    }
  }

  // GET BY ID
  public async getById(id: string): Promise<petsDocument | null> {
    try {
      const pets = await petsModel.findById(id);
      return pets;
    } catch (error) {
      throw error;
    }
  }

  // CREATE
  public async create(petsInput: petsInput): Promise<petsDocument> {
    try {
      // Optional: check if a pets with the same name already exists
      // e.g., const existing = await petsModel.findOne({ name: petsInput.name });
      // if (existing) throw new ReferenceError("pets already exists");

      const pets = await petsModel.create(petsInput);
      return pets;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  public async update(
    id: string,
    petsInput: petsInputUpdate
  ): Promise<petsDocument | null> {
    try {
      // Make sure the pets exists first
      const pets = await this.getById(id);
      if (!pets) {
        throw new ReferenceError("pets not found");
      }

      // Perform the update
      const updatedpets = await petsModel.findByIdAndUpdate(
        id,
        petsInput,
        { new: true } // return the updated doc
      );
      return updatedpets;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  public async delete(id: string): Promise<petsDocument | null> {
    try {
      const pets = await this.getById(id);
      if (!pets) {
        throw new ReferenceError("pets not found");
      }

      const deletedpets = await petsModel.findByIdAndDelete(id);
      return deletedpets;
    } catch (error) {
      throw error;
    }
  }
}

export const petsService = new PetsService();
