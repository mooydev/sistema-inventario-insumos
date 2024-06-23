import bcryptjs from 'bcryptjs';
import UsuarioModel from '../models/UsuarioModel.js';

export const registroUsuario = async (req, res) => {
    try {
        const usuarioExiste = await UsuarioModel.findAll({
            where : {
                nombre: req.body.nombre,
                apellidoPaterno: req.body.apellidoPaterno,
                apellidoMaterno: req.body.apellidoMaterno,
            }
        });
        if(usuarioExiste.length === 0){
            const { nombre, apellidoPaterno, apellidoMaterno, tipoDeUsuario, usuario, contrasena } = req.body;
            const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
            if (!regex.test(nombre) || !regex.test(apellidoPaterno) || !regex.test(apellidoMaterno) || !regex.test(tipoDeUsuario)){
                return res.status(400).json({
                    message: 'Los campos solo deben contener letras del alfabeto español y no signos especiales',
                });
            }

            let contrasenaHaash = await bcryptjs.hash(contrasena, 8);
    
            const datosUsuario = {
                nombre: nombre,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                tipoDeUsuario: tipoDeUsuario,
                usuario: usuario,
                contrasena: contrasenaHaash
            }
            const nuevoUsuario = await UsuarioModel.create(datosUsuario);
            return res.json({ message: "Registro existoso", usuario: nuevoUsuario });
        }else{
            return res.status(400).json({message: 'El usuario ya existe, usted puede restablecer la contraseña o llamar a soporte técnico.'})
        }
    } catch (error) {
        return res.json({ message: error.message })
    }
}