import db from "../database/db.js";

import { DataTypes } from "sequelize";
import InsumoModel from "./InsumoModel.js";

const EntradaModel = db.define('entradas', {
    entradaId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    insumoId: {
        type: DataTypes.INTEGER,
        references:{
            model: InsumoModel,
            key: 'insumoId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    nombre: DataTypes.STRING,
    cantidadEntrante: DataTypes.INTEGER, 
    fechaEntrada: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    unidadMedida: DataTypes.STRING
});

export default EntradaModel;