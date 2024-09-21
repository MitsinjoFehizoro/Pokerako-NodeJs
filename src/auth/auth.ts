import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user-model';
import { handleError } from "../tools/handle-error";
dotenv.config()

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization

    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(' ')[1]
        jwt.verify(
            accessToken,
            process.env.JWT_KEY as string,
            (error, decoded) => {
                if (error) {
                    console.log('refresh token**********');

                    const refreshToken = req.headers.cookie?.split('=')[1]
                    jwt.verify(
                        refreshToken as string,
                        process.env.REFRESH_JWT_KEY as string,
                        async (error, decoded) => {
                            if (error)
                                return res.status(403).json({
                                    message: "🔒 refreshToken a expiré "
                                })

                            const user = await User.findByPk((decoded as { userId: string }).userId);

                            if (!user)
                                return res.status(404).json({
                                    message: "🔒 Votre session a expiré "
                                })

                            const payload = { userId: user.id }
                            const newAccessToken = jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: '15m' })

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
                    )
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
