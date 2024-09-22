import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user-model';
import bcrypt, { compare } from 'bcrypt'
import { handleError } from '../tools/handle-error';
import dotenv from 'dotenv'
import { error401 } from '../tools/error-status';
dotenv.config()

export const signup = async (req: Request, res: Response) => {
    try {
        const { phone, pseudo, password } = req.body;

        let hashedPassword;
        if (password.length > 3) {
            hashedPassword = await bcrypt.hash(password, 10)
        } else {
            hashedPassword = password //Erreur dans la validation
        }

        const newUser = await User.create({
            phone,
            pseudo,
            password: hashedPassword
        });

        res.status(201).json({
            message: "🎉 Votre compte a été créé avec succès !",
            data: newUser
        });
    } catch (error) {
        handleError(error, res)
    }
};


export const login = async (req: Request, res: Response) => {
    const { phone, password } = req.body
    try {
        const user = await User.findOne({ where: { phone: phone } })
        if (!user) {
            return res.status(404).json({
                message: "🤔 Numéro incorrect. Aucun compte trouvé."
            })
        }

        const isValidPassword = await compare(password, user.password)
        if (isValidPassword) {
            const payload = { userId: user.id }
            const accessToken = jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: '1m' })
            const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_KEY as string, { expiresIn: '7d' })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({
                message: `👋 Bonjour ${user.pseudo}, content de te voir ici !`,
                data: user,
                accessToken: accessToken
            })
        } else {
            res.status(401).json({
                message: "🔑 Mot de passe incorrect."
            })
        }

    } catch (error) {
        handleError(error, res)
    }
}

export const refreshAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req.headers.cookie?.split('=')[1]
    if (!refreshAccessToken) return error401(res)
    try {
        const decoded = jwt.verify(
            refreshToken as string,
            process.env.REFRESH_JWT_KEY as string
        )
        const user = await User.findByPk((decoded as { userId: string }).userId)
        if (!user) return error401(res)
        const payload = { userId: user.id }
        const newAccessToken = jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: '1m' })
        res.json({
            message: `👋 Bonjour ${user.pseudo}, content de te voir ici !`,
            data: user,
            accessToken: newAccessToken
        })
    } catch (error) {
        error401(res)
    }
}

export const protectedRoute = (req: Request, res: Response) => {
    res.json({
        message: 'Ressource protegee'
    })
}


