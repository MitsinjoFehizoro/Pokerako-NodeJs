import { Response } from "express";

export const error401 = (res: Response) => {
    res.status(401).json({
        message: "🔒 Votre session a expiré. Veuillez vous reconnecter."
    })
}