import { useContext} from 'react';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { UsuarioContext } from './UsuarioContext.js';


const CompBarraSuperior = () => {

    const {usuario} = useContext(UsuarioContext);
    const {sesionIniciada, setSesionIniciada} = useContext(UsuarioContext);
    let mostrarCerrarSesion = 'none';

    const cerrarSesion = () => {
        console.log(sesionIniciada)
        localStorage.removeItem('token');  // Elimina el token del almacenamiento local
        setSesionIniciada(false);  // Actualiza el estado de la sesión
        window.location.href = '/';  // Redirige al usuario a la página de inicio de sesión
        console.log(sesionIniciada)
    }

    if(sesionIniciada){
        console.log(sesionIniciada)
        mostrarCerrarSesion = ''
    }

    return (
        <div className='barra-superior'>
            <div className='barra-superior-info-taqueria'>
                <p className='barra-superior-info-taqueria-empresa'>Taqueria Ayayay!</p>
                <p className='barra-superior-info-taqueria-sucursal'>Sucursal: Oriente</p>
            </div>
            <div className='barra-superior-info-usuario'>
                <p className='barra-superior-info-usuario-nombre'>{sesionIniciada ? `Sesión iniciada como: ${usuario}` : 'No ha iniciado sesión'}</p>
                <div className='barra-superior-info-usuario-botones'>
                <Button variant="outlined" onClick={cerrarSesion} style={{ display:`${mostrarCerrarSesion}`, border:'none', color:'white', backgroundColor:'red', width:'100%'}} startIcon={<LogoutIcon />}>
                    Cerrar sesión
                </Button>
                </div>
            </div>
        </div>
    );
}

export default CompBarraSuperior;