import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user-model';
dotenv.config()

export const auth = async (req: Request, res: Response, next: NextFunction) => {

    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader)
        return res.status(401).json({
            message: "🔒 Jeton d'authentification requis. Veuillez vous authentifier."
        })

    try {
        const accessToken = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_KEY as string
        )
        req.body.user = decoded
        next()
    } catch (error) {
        console.log('***** REFRESH TOKEN *****');
        const refreshToken = req.headers.cookie?.split('=')[1]
        const decoded = jwt.verify(
            refreshToken as string,
            process.env.REFRESH_JWT_KEY as string
        )
        const user = await User.findByPk((decoded as { userId: string }).userId)
        if (!user) {
            return res.status(403).json({
                message: "🔒 Votre session a expiré. Veuillez se reconnecter."
            })
        }
        const payload = { userId: user.id }
        const newAccessToken = jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: '1m' })

        res.setHeader(`Authorization`, `Bearer ${newAccessToken}`)
        req.headers.authorization = `Bearer ${newAccessToken}`

        jwt.verify(
            newAccessToken,
            process.env.JWT_KEY as string,
            (error, decoded) => {
                if (error)
                    return res.status(403).json({
                        message: "🔒 Votre session a expiré "
                    })
                req.body.user = decoded
                next()
            }
        )
    }
}
