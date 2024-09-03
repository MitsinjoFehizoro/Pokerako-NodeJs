import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt'
import { handleError } from '../tools/handle-error';

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
            data: newUser
        });
    } catch (error) {
        handleError(error, res)
    }
};

export const sendVerificationCode = async (user: User, req: Request, res: Response) => {
    try {

    } catch (error) {

    }
}
