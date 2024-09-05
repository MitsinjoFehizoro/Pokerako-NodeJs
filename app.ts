import userRouter from './src/routes/user-routes'
import { authenticateDataBase, syncronisatonDataBase } from './src/db/sequelize';
import express, { Request, Response, Router } from 'express';
import cors from 'cors'
import dotenv from 'dotenv'


const app = express();
app.use(express.json());
dotenv.config()

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
app.use(cors(corsOptions))

authenticateDataBase();
syncronisatonDataBase();

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Bienvenue dans l\'API de Pokerako.' });
});

app.use('/api', userRouter);

const PORT = 5174;
app.listen(PORT, () => {
    console.log(`Pokerako est lancé sur le port : ${PORT}`);
});
