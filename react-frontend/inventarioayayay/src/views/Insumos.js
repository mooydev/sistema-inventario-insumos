import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CircularProgress from '@mui/material/CircularProgress';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { UsuarioContext } from "../componentsUI/UsuarioContext.js";

const URI = 'http://localhost:8000/insumos'

const CompInsumos = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorAlEliminar, setErrorAlEliminar] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const {usuarioAdmin, setUsuarioAdmin} = useContext(UsuarioContext);

    const [listaInsumos, setListaInsumos] = useState([{
        insumoId: '',
        nombre: '',
        cantidadExistente: '',
        cantidadMinRequerida: '',
        ultFechaEntrada: '',
        updatedAt: ''
    }]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${URI}/todos`, {
                    headers: {
                        Authorization: `Bearer ${token}`  // Incluye el token en el encabezado Authorization
                    }
                });
                setListaInsumos(res.data.insumos);
            } catch (error) {
                console.error(`Error al obtener los insumos: ${error}`);
            }
            setLoading(false);
        };
    
        fetchData();
    }, []);



    const rows = listaInsumos.map(insumo => ({
        id: insumo.insumoId,
        nombre: insumo.nombre,
        existencia: insumo.cantidadExistente,
        medida: insumo.unidadMedida,
        minimo: insumo.cantidadMinRequerida,
        actualizacion: insumo.updatedAt
    }));

    const columns = [
        { field: 'id', headerName: 'ID', type: 'number', width: 50, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'nombre', headerName: 'NOMBRE', width: 150, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'existencia', headerName: 'EN EXISTENCIA', type: 'number', width: 120, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'medida', headerName: 'UNIDAD', width: 100, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'minimo', headerName: 'MINÍMO NECESARIO', type: 'number', width: 150, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        { field: 'actualizacion', headerName: 'FECHA DE ACTUALIZACIÓN', width: 220, editable: false, resizable: false, headerClassName: 'superimposed-header' },
        {
            field: 'eliminar',
            headerName: 'ELIMINAR',
            width: 150,
            renderCell: (params) => (
                <Button variant="contained" color="primary" style={{color:'white', backgroundColor:'red'}} onClick={() => eliminarInsumo(params.row.id)} startIcon={<DeleteIcon></DeleteIcon>} disabled={!usuarioAdmin}>
                    Eliminar
                </Button>
            ),
        }
    ];

    const volverAMenu = () => {
        return <Navigate to="/menu" replace></Navigate>
    }

    const irARegistroProducto = () => {
        navigate('/registroproducto');
    }

    const eliminarInsumo = async(id) =>{
        try {
            const response = await axios.delete(`${URI}/eliminarinsumo/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Incluye el token en el encabezado Authorization
                }
            }
            );
            if(response.status === 200 && response.data.message === 'Insumo eliminado correctamente'){
                setListaInsumos(listaInsumos.filter(insumo => insumo.insumoId !== id)); // Actualiza el estado de los usuarios
                setMostrarAlerta(true);
                setTimeout(() => {
                    setMostrarAlerta(false)
                }, 3000);
                volverAMenu();
            }else{
                setErrorAlEliminar(response.data.message);
                setShowWarning(true);
                setTimeout(() => {
                    setShowWarning(false)
                }, 4000);
            }
        } catch (error) {
            return console.error('Error al eliminar el insumo', error);
        }
    }

    return (
        <div className="insumos-tabla">
            {mostrarAlerta && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="success" onClose={() => { setMostrarAlerta(false) }}>Insumo eliminado correctamente</Alert>}
            {showWarning && <Alert style={{ position: 'fixed', top: '0', width: '45%' }} variant='filled' severity="warning" onClose={() => { setShowWarning(false) }}>{errorAlEliminar}</Alert>}
            {loading ? 
            <CircularProgress /> : (
            <DataGrid
                rowHeight={40}
                disableRowSelectionOnClick
                rows={rows}
                columns={columns}
                getCellClassName={(params) => {
                    if (params.field === 'existencia' && params.value < params.row.minimo) {
                        return 'superimposed-rows';
                    }
                    return '';
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
            />
            )}
            <div className="insumos-tabla-buttons">
            <Link to="/menu">
                <Button variant="contained" onClick={volverAMenu} style={{ borderColor: 'chocolate', color: 'white', backgroundColor: 'chocolate', marginBottom: '2vh', marginTop: '2vh', marginLeft: '2vh' }} startIcon={<HomeIcon></HomeIcon>}>
                    Menú Principal
                </Button>
            </Link>
            <Button variant="contained" color="primary" style={{color:'white', backgroundColor:'green', margin:'2vh'}} onClick={irARegistroProducto} startIcon={<AddBoxIcon></AddBoxIcon>} disabled={!usuarioAdmin} >
                Agregar insumo
            </Button>
            </div>
        </div>
    );
};

export default CompInsumos;