import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import dayjs from 'dayjs';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/insumos';

const CompCambioContrasena  = () => {

    const navigate = useNavigate();

    const [contrasena, setContrasena] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [alertaContrasena, setAlertaContrasena] = useState(false);
    const [errorAlRegistrar, setErrorAlRegistrar] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioId, setUsuarioId] = useState(0);

    const volverAMenu = () => {
        navigate('/menu');
    }

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get(`${URI}/usuarios`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Incluye el token en el encabezado Authorization
                }
            });
            const usuarios = response.data.usuarios;
            setUsuarios(usuarios);
            setUsuarioId(response.data.usuarios[0])
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };


    const cambiarContrasena = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(
                `${URI}/actualizarcontrasena/${usuarioId}`, // Utiliza el ID del usuario seleccionado
                { usuarioId, contrasena },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
            setTimeout(() => {
                volverAMenu()
            }, 3000);

        } catch (error) {
            setErrorAlRegistrar(error.response.data.message);
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
            console.error(error);
        }
    };

    return (
        <div className='registro-usuario'>
            {alertaContrasena && <Alert style={{ position: 'fixed', top: '0', width: '400px' }} variant='filled' severity="warning" onClose={() => { setAlertaContrasena(false) }}>Las contraseñas no coinciden</Alert>}
            {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>{errorAlRegistrar}</Alert>}
            {showAlert && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="success" onClose={() => { setShowAlert(false) }}>Cambio realizado correctamente</Alert>}
            <p className='registro-usuario-titulo'>Restablecer contraseña</p>
            <form className='cambio-formulario' onSubmit={cambiarContrasena}>
                <FormControl style={{gap:'2vh'}}>
                    <InputLabel>Selecciona un usuario</InputLabel>
                    <Select
                        required
                        value={usuarioId} // Asegúrate de tener un estado para almacenar el ID del usuario seleccionado
                        onChange={(e) => setUsuarioId(e.target.value)}
                    >
                        {usuarios.map((usuario) => (
                            <MenuItem 
                                key={usuario.usuarioId} 
                                value={usuario.usuarioId}>
                                {usuario.usuario}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField required label="Nueva contraseña" type="password" onChange={(e) => setContrasena(e.target.value)} />
                    <TextField required label="Confirmar contraseña" type="password"
                        onChange={(e) => {
                            if (e.target.value !== contrasena) {
                                setAlertaContrasena(true)
                            } else {
                                setAlertaContrasena(false)
                            }
                        }}
                    />
                </FormControl>
                <div className='registro-formulario-botones'>
                    <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate', marginBottom: '2vh', marginTop: '2vh', marginLeft: '0', marginRight: '2vh' }} startIcon={<HomeIcon></HomeIcon>}>
                        Menú Principal
                    </Button>
                    <Button variant='contained' type="submit" style={{ borderColor: 'green', color: 'white', backgroundColor: 'green', marginBottom: '2vh', marginTop: '2vh', marginLeft: '2vh', marginRight: '0' }}>Cambiar contraseña</Button>
                </div>
            </form>
        </div>
    );
};

export default CompCambioContrasena;
