import { Response } from "express";
import { ValidationError } from "sequelize";

export const handleError = (error: unknown, res: Response) => {
    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: "🚫 Requête invalide. Veuillez vérifier les données.",
            errorMessages: error.errors.map(e => e.message)
        })
    }
    res.status(500).json({
        message: "🛠️ Erreur interne du serveur. Veuillez réessayer plus tard."
    });
    console.error('Erreur interne du serveur : ', error)
}