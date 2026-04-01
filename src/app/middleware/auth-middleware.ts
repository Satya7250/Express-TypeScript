import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../auth/utils/token.js";

export function authenticationMiddleware(){
    return function(req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']
        if (!header) return next()

        if(!header?.startsWith('Bearer')) {
            return res.status(400).json({ error: 'authorization header must start with Bearer'})
        }

        const token = header.split(' ')[1]

        if(!token){
            return res.status(400).json({ error: 'authorization header must start with Bearer and followed by token'})
        }

        const user = verifyUserToken(token)

        if(user.valid) {
             //@ts-ignore
            req.user = user.payload
        } else if (user.expired) {
             //@ts-ignore
            req.tokenStatus = 'expired'
        }
        next()
    }

}

export function restrictToAuthenticatedUser() {
    return function(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        if(!req.user) {
            //@ts-ignore
            if (req.tokenStatus === 'expired') {
                return res.status(401).json({ error: 'Token Expired', message: 'Your token has expired, please login again'})
            }
            return res.status(401).json({ error: 'Authentication Required'})
        }
        return next()
    }
}