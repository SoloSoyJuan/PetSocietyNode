import { Request, Response } from 'express';
import { UserInput, UserLogin } from "../interfaces";
import { userServices } from "../services";
import { AuthError } from '../exceptions';

class UserController {
    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await  userServices.getAll();
            res.status(200).json(users);    
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({message: "Not found"});
                return;
            }
            res.status(500).json({message: error});
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await userServices.create(req.body as UserInput);
            res.status(201).send(`Create user: ${newUser}`); 
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({message: "User already exists"});
                return;
            }
            res.status(500).json({message: error});
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const user = await userServices.getById(id);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({message: "Not found"});
                return;
            }
            res.status(500).json({message: error});
            
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const userUpdated = await userServices.update(id, req.body as UserInput);
            res.status(200).json(userUpdated);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({message: `User with ${id} not found`});
                return;
            }
            res.status(500).json({message: error});
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const userDeleted = await userServices.delete(id);
            res.status(200).json(userDeleted);
        } catch (error) {
            if (error instanceof ReferenceError) {
                res.status(500).json({message: `User with ${id} not found`});
                return;
            }
            res.status(500).json({message: error});
            
        }
    }

    public async login (req: Request, res: Response) {
        try {
            
            const resObj = await userServices.login(req.body as UserLogin);
            res.status(200).json(resObj);

        } catch (error) {
            
            if (error instanceof AuthError) {
                res.status(401).json({message: "Not authorized"});
                return;
            }
            res.status(500).json(error);
        }
    }

    public async logout (req: Request, res: Response) {
    
    }
}

export const userController = new UserController();