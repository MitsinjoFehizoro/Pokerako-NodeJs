import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user-model';
import bcrypt, { compare } from 'bcrypt'
import { handleError } from '../tools/handle-error';
import dotenv from 'dotenv'
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
            password: hashedPassword,
        });

        res.status(201).json({
            message: "🎉 Votre compte a été créé avec succès !",
            data: newUser,
            errorMessage: null
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
            const accessToken = jwt.sign(payload, process.env.JWT_KEY as string, { expiresIn: '15m' })

            const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_KEY as string, { expiresIn: '7d' })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({
                message: `👋 Bonjour ${user.pseudo}, content de te voir ici !`,
                data: user,
                token: accessToken
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

export const refreshAccessToken = async(req : Request, res :Response)=>{
    
}
