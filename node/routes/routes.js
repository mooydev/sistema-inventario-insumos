import express from 'express';
import { crearInsumo, eliminarInsumo, getInsumo, getInsumos, getReporteDiario, updateInsumosIn, updateInsumosOut } from '../controllers/InsumoController.js';
import { registroUsuario } from '../controllers/RegistroUsuarioController.js';
import { comprobarCredenciales } from '../controllers/InicioDeSesionController.js';
import jwt from 'jsonwebtoken';
import { actualizarContrasena, eliminarUsuario, obtenerUsuarios } from '../controllers/UsuariosController.js';

const router = express.Router();

// Middleware de autenticación
const requireLogin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).send('Primero inicie sesion');
    }
};

router.post('/login', comprobarCredenciales);

router.get('/', (req, res) => {
    if (req.session.login) {
        res.redirect('/menu');
    } else {
        res.send('Primero inicie sesion');
    }
});

router.get('/menu', requireLogin, (req, res) => {
    res.send('Este es el menu');
});
 
// Rutas de 'insumos'
router.use(requireLogin);
router.get('/todos', getInsumos);
router.get('/usuarios/', obtenerUsuarios);
router.get('/:id', getInsumo);
router.get('/reporte/:fecha', getReporteDiario);
router.put('/salida/:id', updateInsumosOut);
router.put('/entrada/:id', updateInsumosIn);
router.put('/actualizarcontrasena/:id', actualizarContrasena);
router.post('/registro/', registroUsuario);
router.post('/registroProducto', crearInsumo)
router.delete('/eliminarUsuario/:id', eliminarUsuario);
router.delete('/eliminarinsumo/:id', eliminarInsumo)

// Middleware de manejo de errores
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

export default router;