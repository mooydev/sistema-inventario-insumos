import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, FormControl, InputLabel, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import HomeIcon from '@mui/icons-material/Home';
import Alert from '@mui/material/Alert';



const URI = 'http://localhost:8000/insumos'

const CompEntradaInsumos = () => {

    const [listaInsumos, setListaInsumos] = useState([{ nombre: '' }]);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [alertaCantidad, setAlertaCantidad] = useState(false);
    const [unidadMedida, setUnidadMedida] = useState('');

    useEffect(() => {
        axios.get(`${URI}/todos`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`  // Incluye el token en el encabezado Authorization
            }
        })
            .then(res => {
                setListaInsumos(res.data.insumos);
                if (res.data.insumos.length > 0) {
                    setInsumoSeleccionado(res.data.insumos[0]);  // Establece el primer insumo como seleccionado por defecto
                    setUnidadMedida(res.data.insumos[0].unidadMedida)
                } else {
                    setInsumoSeleccionado(null);
                }
            });
    }, []);

    const handleChange = (e) => {
        const insumo = listaInsumos.find(item => item.nombre === e.target.value);
        setInsumoSeleccionado(insumo);
        setUnidadMedida(insumo.unidadMedida);
    };

    const actualizarInsumo = async () => {
        try {
            const cantidadNumerica = parseInt(cantidad, 10);
            if(cantidadNumerica < 1){
                setAlertaCantidad(true);
            }else{
            const res = await axios.put(`${URI}/entrada/${insumoSeleccionado.insumoId}`,
                {
                    cantidadEntrante: cantidadNumerica,
                    unidadMedida: unidadMedida
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,  // Incluye el token en el encabezado Authorization
                    }
                }
            )
            if (res.status === 200) {
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 3000)
            }
        }
        } catch (error) {
            console.error(`Error al actualizar el insumo: ${error}`);
            console.log(typeof cantidad)
        }
    }

    const volverAMenu = () => {
        return <Navigate to="/menu" replace></Navigate>
    }

    return (
        <div>
            {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '400px' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>La cantidad debe ser menor a 599</Alert>}
            {showAlert && <Alert style={{ position: 'fixed', top: '0', width: '400px' }} variant='filled' severity="success" onClose={() => { setShowAlert(false) }}>Insumo actualizado correctamente</Alert>}
            {alertaCantidad && <Alert style={{ position: 'fixed', top: '0', width: '400px' }} variant='filled' severity="warning" onClose={() => { setAlertaCantidad(false) }}>La cantidad debe ser mayor o igual 1</Alert>}
            <div className='panel-movimientos-entrada'>
                <div className='panel-movimientos-select'>
                    <p className='panel-movimientos-select-select-span-insumo'>Seleccione el insumo</p>
                    <FormControl style={{ margin: '2vh', gap: '2vh' }} onSubmit={actualizarInsumo}>
                        <InputLabel id="Insumo">Insumo</InputLabel>
                        <Select label="Insumo" value={insumoSeleccionado ? insumoSeleccionado.nombre : ''} onChange={handleChange} name="insumo" required>
                            {listaInsumos.map(item => (
                                <MenuItem key={item.id} value={item.nombre}>{item.nombre}</MenuItem>
                            ))}
                        </Select>
                        <p className='panel-movimientos-select-select-span-cantidad'>Ingrese una cantidad</p>
                        <div className='panel-movimientos-select-select-span-cantidad-cantidad'>
                            <TextField
                                id="Cantidad"
                                label="Cantidad"
                                type="number"
                                value={cantidad}
                                onChange={(e) => {
                                    if (e.target.value <= 599) {
                                        setCantidad(e.target.value);
                                        setShowWarning(false);
                                    } else {
                                        setShowWarning(true);
                                    }
                                }}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: '0',
                                    max: '300',
                                    maxLength: 3
                                }}
                            />
                            <p className='panel-movimientos-select-select-span-cantidad-cantidad-medida'>{unidadMedida}</p>
                        </div>
                    </FormControl>
                </div>
                <div className='panel-movimientos-buttons'>
                    <Link to="/menu">
                        <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate' }} startIcon={<HomeIcon></HomeIcon>}>
                            Menú Principal
                        </Button>
                    </Link>
                    <Button variant="contained" type='submit' onClick={actualizarInsumo} style={{ color: 'white', backgroundColor: 'green' }} endIcon={<AddCircleOutlineIcon></AddCircleOutlineIcon>}>
                        Agregar
                    </Button>
                </div>
                <div>

                </div>
            </div>
        </div>
    );
}

export default CompEntradaInsumos;

