
import { Link, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ListIcon from '@mui/icons-material/List';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import '@fontsource/roboto';
import { Button } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { UsuarioContext } from '../componentsUI/UsuarioContext';
import { useContext, useState } from 'react';
import Alert from '@mui/material/Alert';


const CompMenu = () => {

    const navigate = useNavigate(); // Agrega esta línea
    const {sesionIniciada} = useContext(UsuarioContext);
    const [mostrarAlerta, setMostrarAlerta] = useState(false)

    const verUsuarios = () => {
        if(!sesionIniciada){
            console.log(sesionIniciada)
            setMostrarAlerta(true)
            setTimeout(() => setMostrarAlerta(false), 3000)
            console.log(sesionIniciada)
        }else{
            navigate('/usuarios');
        }
    }


    return (
        <div className='menu'>
            {mostrarAlerta && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setMostrarAlerta(false) }}>Primero inicie sesión</Alert>}
            <Link to="/entrada" className='menu-link'>
                <div className='menu-carta'>
                    <div className='menu-carta-div'>
                        <div className='menu-carta-div-encabezado'>
                            <AddCircleOutlineIcon fontSize='large'></AddCircleOutlineIcon>
                            <p className='menu-carta-div-encabezado-titulo'>Entrada</p>
                        </div>
                        <p className='menu-carta-div-descripcion'>Registra una nueva entrada</p>
                    </div>
                </div>
            </Link>
            <Link to="/salida" className='menu-link'>
                <div className='menu-carta'>
                    <div className='menu-carta-div'>
                        <div className='menu-carta-div-encabezado'>
                            <RemoveCircleOutlineIcon fontSize='large'></RemoveCircleOutlineIcon>
                            <p className='menu-carta-div-encabezado-titulo'>Salida</p>
                        </div>
                        <p className='menu-carta-div-descripcion'>Registra una nueva salida</p>
                    </div>
                </div>
            </Link>
            <Link to="/insumos" className='menu-link'>
                <div className='menu-carta'>
                    <div className='menu-carta-div'>
                        <div className='menu-carta-div-encabezado'>
                            <ListIcon fontSize='large'></ListIcon>
                            <p className='menu-carta-div-encabezado-titulo'>Todos los insumos</p>
                        </div>
                        <p className='menu-carta-div-descripcion'>Ve todos los insumos</p>
                    </div>
                </div>
            </Link>
            <Link to="/reporte" className='menu-link'>
                <div className='menu-carta'>
                    <div className='menu-carta-div'>
                        <div className='menu-carta-div-encabezado'>
                            <ReceiptLongIcon fontSize='large'></ReceiptLongIcon>
                            <p className='menu-carta-div-encabezado-titulo'>Reporte</p>
                        </div>
                        <p className='menu-carta-div-descripcion'>Genera un reporte de movimientos(entradas y salidas)</p>
                    </div>
                </div>
            </Link>
            <Button variant="outlined" onClick={verUsuarios} style={{ border:'none', color:'white', backgroundColor:'orange'}} startIcon={<ManageAccountsIcon></ManageAccountsIcon>}>
                    Administrar usuarios
                </Button>
        </div>
    );
}

export default CompMenu;