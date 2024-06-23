
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Alert, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { UsuarioContext } from '../componentsUI/UsuarioContext.js';


const URI = 'http://localhost:8000/insumos';

const CompUsuarios = () => {

    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [errorAlEliminar, setErrorAlEliminar] = useState('');
    const [alertaNoAdmin, setAlertaNoAdmin] = useState('');
    const [alertaUsuario, setAlertaUsuario] = useState(false)
    const {usuarioAdmin, setUsuarioAdmin} = useContext(UsuarioContext);

    const columnas = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'nombre', headerName: 'NOMBRE', width: 150 },
        { field: 'usuario', headerName: 'USUARIO', width: 150 },
        { field: 'tipoDeUsuario', headerName: 'TIPO DE USUARIO', width: 150 },
        {
            field: 'eliminar',
            headerName: 'ELIMINAR',
            width: 160,
            renderCell: (params) => (
                <Button variant="contained" color="primary" style={{color:'white', backgroundColor:'red'}} onClick={() => eliminarUsuario(params.row.id)} startIcon={<PersonRemoveIcon></PersonRemoveIcon>}
                disabled={!usuarioAdmin}>
                    Eliminar
                </Button>
            ),
        },
        {
            field: 'cambiar',
            headerName: 'MODIFICAR',
            width:200,
            renderCell: (params) => (
                <Button variant="contained" color="primary" style={{color:'white', backgroundColor:'#e5d464'}} onClick={() => navigate('/actualizarcontrasena')}
                disabled={!usuarioAdmin}>
                    Cambiar contraseña
                </Button>
            ),
        },
    ];

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get(`${URI}/usuarios`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Incluye el token en el encabezado Authorization
                }
            });
            const usuarios = response.data.usuarios;
            setUsuarios(usuarios);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const eliminarUsuario = async(id) => {
        try {
            if(!usuarioAdmin){
                setAlertaNoAdmin(true);
                setTimeout(() => {
                    setAlertaNoAdmin(false);
                }, 3000);
                return console.error('Necesitas una cuenta de tipo administrador')
            }
            const response = await axios.delete(`${URI}/eliminarUsuario/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Incluye el token en el encabezado Authorization
                }
            });
            if(response.status === 200 && response.data.message === 'Usuario eliminado correctamente'){
                setUsuarios(usuarios.filter(usuario => usuario.usuarioId !== id));// Actualiza el estado de los usuarios
                setAlertaUsuario(true);
                setTimeout(() => setAlertaUsuario(false), 3000);
            }else{
                setErrorAlEliminar(response.data.message);
                setShowWarning(true);
                setTimeout(() => {
                    setShowWarning(false)
                }, 4000);
            }
            obtenerUsuarios();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };
    

    const rows = usuarios.map(usuario=>({
        id: usuario.usuarioId,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        tipoDeUsuario: usuario.tipoDeUsuario,
    }))

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const volverAMenu = () => {
        navigate('/menu');
    }

    const irARegistro = () => {
        navigate('/registrousuario');
    }
    
    return (
        <div className='usuarios-tabla'>
            {alertaUsuario && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="success" onClose={() => { setAlertaUsuario(false) }}>Usuario eliminado</Alert>}
            {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>{errorAlEliminar}</Alert>}
            {alertaNoAdmin && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="error" onClose={() => { setAlertaNoAdmin(false) }}>Necesitas una cuenta tipo administrador</Alert>}
            <DataGrid
                rows={rows}
                columns={columnas}
                rowHeight={40}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
            <div className='usuarios-tabla-botones'>
             <Link to="/menu">
                <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate', margin:'2vh'}} startIcon={<HomeIcon></HomeIcon>}>
                    Menú Principal
                </Button>
            </Link>
            <Button variant="contained" color="primary" style={{color:'white', backgroundColor:'green', margin:'2vh'}} onClick={irARegistro} startIcon={<PersonAddIcon></PersonAddIcon>} disabled={!usuarioAdmin}>
                Agregar Usuario
            </Button>
            </div>
        </div>
    );
}

export default CompUsuarios;