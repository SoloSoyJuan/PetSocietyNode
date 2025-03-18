// routes/pets.routes.ts

import { Router } from "express";
import { petsController } from "../controllers"; // Adjust path as needed
import { validatePetSSchema } from "../middlewares";
import { petsSchema, petsUpdateSchema } from "../schemas";

export const petsRouter = Router();

petsRouter.get("/", petsController.getAll);
petsRouter.post("/", validatePetSSchema(petsSchema), petsController.create);
petsRouter.get("/:id", petsController.getById);
petsRouter.put("/:id", validatePetSSchema(petsUpdateSchema), petsController.update);
petsRouter.delete("/:id", petsController.delete);
