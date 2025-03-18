import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validatePetSSchema = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            res.status(400).json(error);
        }
    }
}