import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export const auth = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined =  req.header("Authorization"); 

    if(!token){
        res.status(401).json("Not Authorized");
        return;
    }

    try {
        token = token.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

        req.body.loggedUser = decoded;

        if (!decoded || !decoded.user.roles || !roles.some(role => decoded.user.roles.includes(role))) {
            res.status(403).json("Forbidden");
            return;
        }
        
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError){
            res.status(401).json("Token Expired");
            return;
        }
        res.status(401).json("Invalid Token");
    }
}