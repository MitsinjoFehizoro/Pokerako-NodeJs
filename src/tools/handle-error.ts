import { Response } from "express";
import { ValidationError } from "sequelize";

export const handleError = (error: unknown, res: Response) => {
    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: "🚫 Requête invalide. Veuillez vérifier les données.",
            data: null,
            errorMessage: error.message
        })
    }
    const message = "🛠️ Erreur interne du serveur. Veuillez réessayer plus tard."
    res.status(500).json({
        message: message,
        data: null,
        errorMessage: message
    });
    console.error('Erreur interne du serveur : ', error)
}