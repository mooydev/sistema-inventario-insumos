import bcryptjs from 'bcryptjs';
import UsuarioModel from '../models/UsuarioModel.js';
import jwt from 'jsonwebtoken';


export const comprobarCredenciales = async(req, res) => {
    try{
        const { usuario, contrasena } = req.body;
        const usuarioEncontrado = await UsuarioModel.findOne({
            where: {usuario: usuario,
            }
        })
        if(!usuarioEncontrado || !(await bcryptjs.compare(contrasena, usuarioEncontrado.contrasena))){
            return res.json({message: 'Usuario y/o contraseña incorrectos, o campos vacios.'})
        } 
        req.session.login = true 
        const token = jwt.sign({ usuario: req.body.usuario }, process.env.JWT_SECRET);
        return res.json({ usuarioEncontrado, message: 'Inicio de sesión exitoso', token });
    } catch(error){
        return res.status(400).json({message: error.message})
    }
}


