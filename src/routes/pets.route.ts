// routes/pets.routes.ts

import { Router } from "express";
import { petsController } from "../controllers"; // Adjust path as needed

export const petsRouter = Router();

petsRouter.get("/", petsController.getAll);
petsRouter.post("/", petsController.create);
petsRouter.get("/:id", petsController.getById);
petsRouter.put("/:id", petsController.update);
petsRouter.delete("/:id", petsController.delete);
