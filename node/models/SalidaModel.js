import db from "../database/db.js";

import { DataTypes } from "sequelize";
import InsumoModel from "./InsumoModel.js";

const SalidaModel = db.define('salidas', {
    salidaId:{
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
    cantidadSaliente: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    unidadMedida: DataTypes.STRING
});

export default SalidaModel;