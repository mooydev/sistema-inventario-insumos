import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UsuarioModel = db.define( 'usuarios', {
    usuarioId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: DataTypes.STRING,
    apellidoPaterno: DataTypes.STRING,
    apellidoMaterno: DataTypes.STRING,
    tipoDeUsuario: DataTypes.STRING,
    usuario: DataTypes.STRING,
    contrasena: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
})

export default UsuarioModel;