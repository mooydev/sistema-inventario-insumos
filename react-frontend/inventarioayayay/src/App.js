import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { UsuarioContext } from './componentsUI/UsuarioContext.js';
import CompIncioDeSesion from './views/Login.js';
import CompMenu from './views/Menu.js';
import CompBarraSuperior from './componentsUI/BarraSuperior.js';
import { useState } from 'react';
import CompEntradaInsumos from './views/EntradaInsumo.js';
import CompSalidaInsumos from './views/SalidaInsumo.js';
import CompInsumos from './views/Insumos.js';
import CompReporte from './views/Reporte.js';
import CompUsuarios from './views/Usuarios.js';
import CompRegistroUsuario from './views/RegistroUsuario.js';
import CompRegistroProducto from './views/RegistroProducto.js';
import CompCambioContrasena from './views/CambioContraseña.js';

function App() {

  const [usuario, setUsuario] = useState('');
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);

  return (
    <div className="App">
      <UsuarioContext.Provider value={{ usuario, setUsuario, sesionIniciada, setSesionIniciada, usuarioAdmin, setUsuarioAdmin }}>
      <header className="App-header">
        <CompBarraSuperior></CompBarraSuperior>
      </header>
      <main className='AppMain'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<CompIncioDeSesion></CompIncioDeSesion>}/>
            <Route path='/menu' element={<CompMenu></CompMenu>}/>
            <Route path='/entrada' element={<CompEntradaInsumos></CompEntradaInsumos>}/>
            <Route path='/salida' element={<CompSalidaInsumos></CompSalidaInsumos>}/>
            <Route path='/insumos' element={<CompInsumos></CompInsumos>}/>
            <Route path='/reporte' element={<CompReporte></CompReporte>}/>
            <Route path='/usuarios' element={<CompUsuarios></CompUsuarios>}/>
            <Route path='/registrousuario' element={<CompRegistroUsuario></CompRegistroUsuario>}/>
            <Route path='/registroproducto' element={<CompRegistroProducto></CompRegistroProducto>}/>
            <Route path='/actualizarcontrasena' element={<CompCambioContrasena></CompCambioContrasena>}/>
          </Routes>
        </BrowserRouter>
      </main>
      </UsuarioContext.Provider>
    </div>
  );
}

export default App;
