// controllers/pets.controller.ts

import { Request, Response } from "express";
import { petsService } from "../services";
import { petsInput, petsInputUpdate } from "../interfaces";

class PetsController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const petss = await petsService.getAll();
      res.status(200).json(petss);
    } catch (error) {
      // If it's a ReferenceError (like "No petss found")
      if (error instanceof ReferenceError) {
        res.status(500).json({ message: "No petss found" });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newpets = await petsService.create(req.body as petsInput);
      // Return the created document
      res.status(201).json(newpets);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: "pets already exists" });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pets = await petsService.getById(id);
      res.status(200).json(pets);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(500).json({ message: "pets not found" });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedpets = await petsService.update(
        id,
        req.body as petsInputUpdate
      );
      res.status(200).json(updatedpets);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res
          .status(500)
          .json({ message: `pets with id ${req.params.id} not found` });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const petsDeleted = await petsService.delete(id);
      res.status(200).json(petsDeleted);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res
          .status(500)
          .json({ message: `pets with id ${req.params.id} not found` });
        return;
      }
      res.status(500).json({ message: error });
    }
  }
}

export const petsController = new PetsController();


