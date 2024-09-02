import userRouter from './src/routes/user-routes'
import { authenticateDataBase, syncronisatonDataBase } from './src/db/sequelize';
import express, { Request, Response, Router } from 'express';

const app = express();

authenticateDataBase();
syncronisatonDataBase();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Bienvenue dans l\'API de Pokerako.' });
});

app.use('/api', userRouter);

const PORT = 5174;
app.listen(PORT, () => {
    console.log(`Pokerako est lancé sur le port : ${PORT}`);
});
