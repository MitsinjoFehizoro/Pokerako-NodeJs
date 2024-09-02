import { DataTypes } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv'
import User from "../models/user";

dotenv.config();
export const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    models: [User]
})

export const authenticateDataBase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connexion réussite avec la bdd.')
    } catch (error) {
        console.error('Erreur de la connexion avec la bdd : ', error)
    }
}

export const syncronisatonDataBase = async () => {
    try {
        await sequelize.sync({ force: true })
        console.log('Syncronisation réussite de la la bdd.')
    } catch (error) {
        console.error('Erreur de la syncronisation avec la bdd : ', error)
    }
}


