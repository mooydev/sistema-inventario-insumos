import bcryptjs from 'bcryptjs';
import UsuarioModel from '../models/UsuarioModel.js';

export const obtenerUsuarios = async(req, res)=>{
    try {
        const usuarios = await UsuarioModel.findAll();
        return res.status(200).json({usuarios})
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const eliminarUsuario = async(req, res) =>{
    try {
        const usuariosAdmin = await UsuarioModel.findAll({
            where: {
                tipoDeUsuario: 'admin'
            }
            }
        );
        if(usuariosAdmin.length >= 1){
            const usuario = await UsuarioModel.findOne({
                where: {usuarioId: req.params.id}
            })
            if(!usuario){
                return res.status(404).json({message: 'El usuario no se encontró'})
            }
            if(usuario.tipoDeUsuario === 'admin' && usuariosAdmin.length === 1){
                return res.status(200).json({message: 'Se necesita por lo menos un usuario tipo administrador'}) 
            }
            await usuario.destroy()
            return res.status(200).json({message: 'Usuario eliminado correctamente'})
        }else{
            return res.status(200).json({message: 'Se necesita por lo menos un usuario tipo administrador'})
        }
    } catch (error) {
        return res.status(400).json({message: error.message })
    }
};

export const actualizarContrasena = async (req, res) => {
    try {
        const { usuarioId, contrasena } = req.body;

        // Busca el usuario por su ID
        const usuario = await UsuarioModel.findOne({
            where: { usuarioId }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'El usuario no se encontró' });
        }

        // Hashea la nueva contraseña
        const hashedPassword = await bcryptjs.hash(contrasena, 8);

        // Actualiza la contraseña del usuario
        await usuario.update({ contrasena: hashedPassword });

        return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
