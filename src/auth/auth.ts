import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const authoriztionHeader = req.headers.authorization
    if (authoriztionHeader) {
        const token = authoriztionHeader.split(' ')[1]
        jwt.verify(
            token,
            process.env.JWT_KEY as string,
            (error, decoded) => {
                if (error) {
                    res.status(403).json({
                        message: "🔒 Votre session a expiré. Merci de vous reconnecter.",
                    }) 
                } else {
                    req.body.user = decoded
                    next()
                }
            }
        )
    } else {
        res.status(401).json({
            message: "🔒 Jeton d'authentification requis. Veuillez vous authentifier."
        })
    }
}