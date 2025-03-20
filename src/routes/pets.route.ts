// routes/pets.routes.ts

import { Router } from "express";
import { petsController } from "../controllers"; // Adjust path as needed
import { auth, validateSchema } from "../middlewares";
import { petsSchema, petsUpdateSchema } from "../schemas";

export const petsRouter = Router();

petsRouter.get("/", 
    auth(['Admin','Vet','Owner']), petsController.getAll);
petsRouter.post("/", 
    auth(['Admin', 'Vet']), 
    validateSchema(petsSchema), petsController.create);
petsRouter.get("/:id", 
    auth(['Admin','Vet','Owner']), petsController.getById);
petsRouter.put("/:id", 
    auth(['Admin','Vet']), 
    validateSchema(petsUpdateSchema), petsController.update);
petsRouter.delete("/:id", 
    auth(['Admin','Vet']), petsController.delete);
