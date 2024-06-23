import moment from "moment-timezone";
import db from "../database/db.js";

import { DataTypes } from "sequelize";

const InsumoModel = db.define('insumos', {
    insumoId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: DataTypes.STRING, 
    cantidadExistente: DataTypes.INTEGER, 
    cantidadMinRequerida: DataTypes.INTEGER,
    ultFechaEntrada: DataTypes.DATE,
    ultFechaSalida: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    unidadMedida: DataTypes.STRING,
},
);

export default InsumoModel;