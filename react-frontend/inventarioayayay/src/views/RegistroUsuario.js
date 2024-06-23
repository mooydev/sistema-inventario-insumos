import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import dayjs from 'dayjs';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/insumos';

const CompRegistroUsuario = () => {

    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [alertaNombre, setAlertaNombre] = useState(false);
    const [alertaContrasena, setAlertaContrasena] = useState(false);
    const [errorAlRegistrar, setErrorAlRegistrar] = useState('');

    const generarUsuario = () => {
        const year = dayjs().year();
        const hora = dayjs().format('HHmm');
        return `${year}${hora}${nombre.slice(0, 2).toUpperCase()}${apellidoPaterno.slice(0, 2).toUpperCase()}${apellidoMaterno.slice(0, 2).toUpperCase()}`;
    };

    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;

    const crearUsuario = async (event) => {
        event.preventDefault();
        try {
            const usuario = generarUsuario();
            const registroDeUsuario = await axios.post(`${URI}/registro`, {
                nombre: nombre,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                tipoDeUsuario: tipoUsuario,
                usuario: usuario,
                contrasena: contrasena
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Incluye el token en el encabezado Authorization
                }
            })
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            setErrorAlRegistrar(error.response.data.message);
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
            return console.error(error);
        }
    };

    const volverAMenu = () => {
        navigate('/menu');
    }

    return (
        <div className='registro-usuario'>
            {alertaContrasena && <Alert style={{ position: 'fixed', top: '0', width: '400px' }} variant='filled' severity="warning" onClose={() => { setAlertaContrasena(false) }}>Las contraseñas no coinciden</Alert>}
            {alertaNombre && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setAlertaNombre(false) }}>Los campos de nombre y apellidos no puede contener caracteres especiales ni números</Alert>}
            {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>{errorAlRegistrar}</Alert>}
            {showAlert && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="success" onClose={() => { setShowAlert(false) }}>Usuario registrado correctamente</Alert>}
            <p className='registro-usuario-titulo'>Registro de usuario</p>
            <p className='registro-usuario-subtitulo'>Ingrese los datos del nuevo usuario</p>
            <form className='registro-usuario-formulario' onSubmit={crearUsuario}>
                <TextField required label="Nombre" 
                onChange={(e) => {
                    if(!regex.test(e.target.value)){
                        setAlertaNombre(true);
                        setTimeout(() => {
                            setAlertaNombre(false)
                        }, 3000);
                    }
                        setNombre(e.target.value)
                }}/>
                <TextField required label="Apellido Paterno" 
                onChange={(e) => {
                    if(!regex.test(e.target.value)){
                        setAlertaNombre(true);
                        setTimeout(() => {
                            setAlertaNombre(false)
                        }, 3000);
                    }
                        setApellidoPaterno(e.target.value)
                }} />
                <TextField required label="Apellido Materno" 
                onChange={(e) => {
                    if(!regex.test(e.target.value)){
                        setAlertaNombre(true);
                        setTimeout(() => {
                            setAlertaNombre(false)
                        }, 3000);
                    }
                        setApellidoMaterno(e.target.value)
                }} />
                <FormControl>
                    <InputLabel>Tipo de Usuario</InputLabel>
                    <Select required value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="usuario">Usuario</MenuItem>
                    </Select>
                </FormControl>
                <TextField required label="Contraseña" type="password" onChange={(e) => setContrasena(e.target.value)} />
                <TextField required label="Confirmar contraseña" type="password" 
                onChange={(e) => {
                    if(e.target.value !== contrasena){
                        setAlertaContrasena(true)
                }else{
                    setAlertaContrasena(false)
                }}}
                />
                <div className='registro-formulario-botones'>
                    <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate', marginBottom: '2vh', marginTop: '2vh', marginLeft: '0', marginRight: '2vh' }} startIcon={<HomeIcon></HomeIcon>}>
                        Menú Principal
                    </Button>
                    <Button variant='contained' type="reset" style={{ borderColor: 'blue', color: 'white', backgroundColor: 'blue', marginBottom: '2vh', marginTop: '2vh', marginLeft: '2vh', marginRight: '1vh' }} >Limpiar</Button>
                    <Button variant='contained' type="submit" style={{ borderColor: 'green', color: 'white', backgroundColor: 'green', marginBottom: '2vh', marginTop: '2vh', marginLeft: '2vh', marginRight: '0' }}>Crear Usuario</Button>
                </div>
            </form>
        </div>
    );
};

export default CompRegistroUsuario;
