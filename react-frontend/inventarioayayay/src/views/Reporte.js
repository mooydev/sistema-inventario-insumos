import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Alert, Button, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import HomeIcon from '@mui/icons-material/Home';
import { Link, Navigate } from 'react-router-dom';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';


const URI = 'http://localhost:8000/insumos'


const CompReporte = () => {

    const [fecha, setFecha] = useState('');
    const [tipoMovimiento, setTipoMovimiento] = useState('');
    const [listaEntradaInsumos, setListaEntradaInsumos] = useState([]);
    const [listaSalidaInsumos, setListaSalidaInsumos] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [errorAlObtenerReporte, setErrorAlObtenerReporte] = useState('');


    const obtenerReporte = async () => {
        try {
            const response = await axios.get(`${URI}/reporte/${fecha}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,  // Incluye el token en el encabezado Authorization
                }
            })
                .then(res => {
                    if(res.status === 200 && res.data.message === 'Insumos con moviento de fecha'){
                        setListaEntradaInsumos(res.data.entradas);
                        setListaSalidaInsumos(res.data.salidas);
                    }else{
                        setErrorAlObtenerReporte(res.data.message)
                        setShowWarning(true);
                        setTimeout(() => {
                            setShowWarning(false)
                        }, 4000);
                    }
                })
        } catch (error) {
            return console.error(error.message);
        }
    };

    const rows = () => {
            if (tipoMovimiento === 'entradas') {
                return listaEntradaInsumos.map((insumo, index) => ({
                    id: index,
                    movimientoid: insumo.entradaId,
                    insumoid: insumo.insumoId,
                    nombre: insumo.nombre,
                    cantidad: insumo.cantidadEntrante,
                    tipo: 'Entrada',
                    fecha: insumo.createdAt
                }));
            } else if (tipoMovimiento === 'salidas') {
                return listaSalidaInsumos.map((insumo, index) => ({
                    id: index,
                    movimientoid: insumo.salidaId,
                    insumoid: insumo.insumoId,
                    nombre: insumo.nombre,
                    cantidad: insumo.cantidadSaliente,
                    tipo: 'Salida',
                    fecha: insumo.createdAt
                }));
            } else {
                return []; // Devuelve un array vacío si tipoMovimiento no es 'entradas' ni 'salidas'
            }
        }
    


    const volverAMenu = () => {
        return <Navigate to="/menu" replace></Navigate>
    }

    const columns = [
        { field: 'movimientoid', headerName: 'MOVIMIENTO ID', type: 'number', width: 150, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'insumoid', headerName: 'INSUMO ID', type: 'number', width: 150, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'nombre', headerName: 'NOMBRE', width: 200, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'cantidad', headerName: 'CANTIDAD', type: 'number', width: 100, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'tipo', headerName: 'TIPO', width: 200, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'fecha', headerName: 'FECHA DE MOVIMIENTO', width: 200, editable: false, resizable: false, headerClassName: 'superimposed-header' },
    ];

    return (
        <div className='movimientos'>
            {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '50vh' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>{errorAlObtenerReporte}</Alert>}
            <div className='movimientos-input'>
                <div className="movimientos-input-titulo">
                    <p>Reportes de movimiento</p>
                </div>
                <div className="movimientos-input-inputs">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Seleccione una fecha" onChange={(date) => { setFecha(date) }} />
                        </DemoContainer>
                    </LocalizationProvider>
                    <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                    <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tipoMovimiento}
                        onChange={(e) => { setTipoMovimiento(e.target.value) }} name="tipo" required>
                        <MenuItem value={'entradas'}>Entradas</MenuItem>
                        <MenuItem value={'salidas'}>Salidas</MenuItem>
                    </Select>
                    <Button variant="contained" type='submit' onClick={obtenerReporte} style={{ color: 'white', backgroundColor: 'green' }} endIcon={<ManageSearchIcon></ManageSearchIcon>}>
                        Buscar
                    </Button>
                </div>
            </div>
            <div className='movimientos-lista'>
                <DataGrid
                    rowHeight={40}
                    disableRowSelectionOnClick
                    rows={rows()}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                />
                <Link to="/menu">
                    <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate', marginBottom: '2vh', marginTop: '2vh', marginLeft: '2vh' }} startIcon={<HomeIcon></HomeIcon>}>
                        Menú Principal
                    </Button>
                </Link>
            </div>
        </div>

    );
}

export default CompReporte;