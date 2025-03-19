import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { AnyZodObject } from 'zod';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined =  req.header("Authorization"); 

    if(!token){
        res.status(401).json("Not Authorized");
        return;
    }

    try {
        token = token.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.body.loggedUser = decoded;
        console.log(decoded);
        req.params.id = decoded.user.id;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError){
            res.status(401).json("Token Expired");
            return;
        }
        res.status(401).json("Not Authorized");
    }
}

export const validateSchema = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            res.status(400).json(error);
        }
    }
}