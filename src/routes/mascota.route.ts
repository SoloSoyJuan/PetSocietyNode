// routes/mascota.routes.ts

import { Router } from "express";
import { mascotaController } from "../controllers"; // Adjust path as needed

export const mascotaRouter = Router();

mascotaRouter.get("/", mascotaController.getAll);
mascotaRouter.post("/", mascotaController.create);
mascotaRouter.get("/:id", mascotaController.getById);
mascotaRouter.put("/:id", mascotaController.update);
mascotaRouter.delete("/:id", mascotaController.delete);
