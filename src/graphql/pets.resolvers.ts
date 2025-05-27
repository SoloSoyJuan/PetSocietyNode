import { petsService } from "../services";
import { petsInput } from "../interfaces";
import { petsDocument } from "../models";

export const petResolvers = {
  Query: {
    pet: async (_root: any, params: any) => {
        const pet: petsDocument | null = await petsService.getById(params.id);
        return pet;
    },
    pets: async (_root: any) => {
        return await petsService.getAll()
    }
  },
  Mutation: {
    createPet: async (_root: any, params: any) => {
        const pet: petsDocument | null = await petsService.create(params.input as petsInput);
        if (!pet) throw new Error("Error creating pet")
        return pet;
    },
    updatePet: async (_root: any, params: any) => {
      const pet = await petsService.update(params.id, params.input as petsInput);
      if (!pet) throw new Error("Pet not found")
      return pet
    },
    deletePet: async (_root: any, params: any) => {
        return await petsService.delete(params.id);
    }
  },
}