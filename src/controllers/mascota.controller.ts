// controllers/mascota.controller.ts

import { Request, Response } from "express";
import { mascotaService } from "../services";
import { MascotaInput, MascotaInputUpdate } from "../interfaces";

class MascotaController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const mascotas = await mascotaService.getAll();
      res.status(200).json(mascotas);
    } catch (error) {
      // If it's a ReferenceError (like "No mascotas found")
      if (error instanceof ReferenceError) {
        res.status(500).json({ message: "No mascotas found" });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newMascota = await mascotaService.create(req.body as MascotaInput);
      // Return the created document
      res.status(201).json(newMascota);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: "Mascota already exists" });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mascota = await mascotaService.getById(id);
      res.status(200).json(mascota);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(500).json({ message: "Mascota not found" });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedMascota = await mascotaService.update(
        id,
        req.body as MascotaInputUpdate
      );
      res.status(200).json(updatedMascota);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res
          .status(500)
          .json({ message: `Mascota with id ${req.params.id} not found` });
        return;
      }
      res.status(500).json({ message: error });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mascotaDeleted = await mascotaService.delete(id);
      res.status(200).json(mascotaDeleted);
    } catch (error) {
      if (error instanceof ReferenceError) {
        res
          .status(500)
          .json({ message: `Mascota with id ${req.params.id} not found` });
        return;
      }
      res.status(500).json({ message: error });
    }
  }
}

export const mascotaController = new MascotaController();


