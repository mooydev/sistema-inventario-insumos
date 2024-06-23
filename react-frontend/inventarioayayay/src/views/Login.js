import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { UsuarioContext } from '../componentsUI/UsuarioContext.js';
import { Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const URI = 'http://localhost:8000/insumos'

const CompIncioDeSesion = () => {

    const { usuario, setUsuario, sesionIniciada, setSesionIniciada, usuarioAdmin, setUsuarioAdmin } = useContext(UsuarioContext);
    const [contrasena, setContrasena] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const iniciarSesion = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URI}/login/`, { usuario, contrasena });
            if (response.data.message === 'Inicio de sesión exitoso') {
                setUsuario(usuario);
                setSesionIniciada(true);
                localStorage.setItem('token', response.data.token);
                if (response.data.usuarioEncontrado.tipoDeUsuario === 'admin') {
                    setUsuarioAdmin(true);
                } else {
                    setUsuarioAdmin(false);
                }
            } else {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000)
            }
        } catch (error) {
            return console.log(error);
        }
    };

    if (sesionIniciada) {
        return <Navigate to="/menu" replace></Navigate>
    }

    return (
        <div className='login'>
            {showAlert && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="error" onClose={() => { setShowAlert(false) }}>Usuario y/o contraseña incorrectos. Compruebe y vuelva a intentar</Alert>}
            <p className='login-titulo'>Bienvenido</p>
            <p className='login-subtitulo'>Para continuar ingrese su usuario y contraseña</p>
            <form className='login-form' onSubmit={iniciarSesion}>
                <div className='login-input-div'><label className='login-label' htmlFor='usuario'>Usuario</label>
                    <input
                        className='login-input'
                        type="text"
                        value={usuario} onChange={(e) => setUsuario(e.target.value)}
                        placeholder="" required />
                </div>
                <div className='login-input-div-contraseña'><label className='login-label' htmlFor='contrasena'>Contraseña</label>
                <div className='login-input-div-contraseña-input-boton'>
                    <input
                        className='login-input-contrasena'
                        type={showPassword ? 'text' : 'password'}
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        placeholder=""
                        required />
                    <button
                        className='show-password-button'
                        onClick={() => setShowPassword(!showPassword)}
                        type='button'
                        >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </button>
                </div>
                </div>
                <Button
                    style={{ marginLeft: '4%', marginRight: '4%', marginTop: '4%', marginBottom: '6%', backgroundColor: 'chocolate', width: '100%' }}
                    variant='contained'
                    type="submit">Iniciar sesión
                </Button>
            </form>
            <p style={{fontSize:'1.6vh', color: 'black',  marginTop:'0', marginLeft:'3vh', marginRight:'3vh', marginBottom:'0'}}>Si tienes problemas, un administrador puede restablecer tu contraseña.</p>
            <p style={{fontSize:'1.6vh', color: 'black',  marginTop:'0', marginLeft:'3vh', marginRight:'3vh', marginBottom:'3vh'}}>En el panel "Administrar usuarios" del menú principal.   </p>
            {/* <Link style={{fontSize:'2vh', marginTop:'0', marginBottom:'3vh'}}>Restablecer contraseña </Link> */}
        </div>
    );
};

export default CompIncioDeSesion;
