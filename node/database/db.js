import { Sequelize } from "sequelize";
import { config } from 'dotenv';
config({ path: './env/.env' });


const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '-06:00',  // Zona horaria de tu servidor de base de datos
    dialectOptions: {
        timezone: 'Z', // Forzar UTC en MySQL
    },
    port: 3306
});

export default db;