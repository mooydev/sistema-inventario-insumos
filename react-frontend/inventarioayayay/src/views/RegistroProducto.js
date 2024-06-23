import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';

const URI = 'http://localhost:8000/insumos';

const CompRegistroProducto = () => {
    const [nombre, setNombre] = useState('');
    const [cantidadExistente, setCantidadExistente] = useState(0);
    const [cantidadMinRequerida, setCantidadMinRequerida] = useState(0);
    const [unidadMedida, setUnidadMedida] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [errorAlCrear, setErrorAlCrear] = useState('');
    const [alertaError, setAlertaError] = useState(false);
    const [alertaNombre, setAlertaNombre] = useState(false);
    const [alertaCantidad, setAlertaCantidad] = useState(false);

    const navigate = useNavigate();
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]*$/;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const cantidadExisNumerica = parseInt(cantidadExistente, 10);
            const cantidadMinNumerica = parseInt(cantidadMinRequerida, 10);
            if(cantidadExisNumerica >= 1 && cantidadMinNumerica >= 1){
                const response = await axios.post(`${URI}/registroProducto`, {
                    nombre,
                    cantidadExistente: cantidadExisNumerica,
                    cantidadMinRequerida: cantidadMinNumerica,
                    unidadMedida
                },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Incluye el token en el encabezado Authorization
                        }
                    }
                )
                if (response.status === 200 && response.data.message === 'Insumo creado correctamente') {
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 1500);
                    setTimeout(() => {
                        navigate('/insumos');
                    }, 2000);
                } else {
                    setErrorAlCrear(response.data.message);
                    setShowWarning(true)
                    setTimeout(() => {
                        setShowWarning(false);
                    }, 3000);
                }
            }else{
                setAlertaCantidad(true)
            }
        } catch (error) {
            return console.error(error);
        }
    };


    const volverAMenu = () => {
        navigate('/menu');
    }

    return (
        <div className='registro-producto'>
            {showAlert && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="success" onClose={() => { setShowAlert(false) }}>Insumo creado correctamente</Alert>}
            {alertaCantidad && <Alert style={{ position: 'fixed', top: '0', width: '400px' }} variant='filled' severity="warning" onClose={() => { setAlertaCantidad(false) }}>Las cantidades debe ser mayores o iguales a 1</Alert>}
            <p className='registro-producto-form-titulo'>Registro de nuevo insumo</p>
            <form className='registro-producto-form' onSubmit={handleSubmit}>
                <TextField 
                label="Nombre" 
                value={nombre} 
                required
                onChange={(e) => {
                    if(!regex.test(e.target.value)){
                        setAlertaNombre(true);
                        setTimeout(() => {
                            setAlertaNombre(false)
                        }, 3000);
                    }
                        setNombre(e.target.value)
                }}
                />
                <TextField
                    label="Cantidad Inicial"
                    type='number'
                    required
                    inputProps={{
                        min: '0',
                        max: '300',
                        maxLength: 3
                    }}
                    value={cantidadExistente}
                    onChange={(e) => {
                        if (e.target.value <= 599) {
                            setCantidadExistente(e.target.value)
                            setShowWarning(false)
                            
                        } else {
                            setShowWarning(true);
                        }
                    }} />
                <TextField
                    label="Cantidad Mínima Requerida"
                    type='number'
                    required
                    inputProps={{
                        min: '0',
                        max: '300',
                        maxLength: 3
                    }}
                    value={cantidadMinRequerida}
                    onChange={(e) => {
                        if (e.target.value <= 599) {
                            setCantidadMinRequerida(e.target.value)
                            setShowWarning(false)
                        } else {
                            setShowWarning(true);
                        }
                    }} />
                <FormControl>
                    <InputLabel>Unidad de Medida</InputLabel>
                    <Select required value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)}>
                        <MenuItem value="Kg">Kg</MenuItem>
                        <MenuItem value="Pz">Pz</MenuItem>
                        <MenuItem value="Lt">Lt</MenuItem>
                    </Select>
                </FormControl>
                <div className='registro-producto-form-botones'>
                <Link to="/menu">
                    <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate', marginBottom: '2vh', marginTop: '2vh', marginLeft: '0' }} startIcon={<HomeIcon></HomeIcon>}>
                        Menú Principal
                    </Button>
                </Link>
                <Button variant="contained" type='submit' color="primary" style={{ color: 'white', backgroundColor: 'green', margin: '2vh', marginRight:'0'}} onClick={handleSubmit} startIcon={<AddBoxIcon></AddBoxIcon>}>
                    Agregar insumo
                </Button>
                </div>
                {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>La cantidad debe ser menor a 599</Alert>}
                {alertaNombre && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setAlertaNombre(false) }}>El nombre no puede contener caracteres especiales</Alert>}
                {alertaError && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="error" onClose={() => { setAlertaError(false) }}>{errorAlCrear}</Alert>}
            </form>
        </div>
    );
}

export default CompRegistroProducto;
