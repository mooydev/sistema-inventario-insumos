import { createContext } from 'react';

export const UsuarioContext = createContext({
    usuario: '',
    setUsuario: () => {},
    sesionIniciada: false,
    setSesionIniciada: () => {},
    usuarioAdmin: false,
    setUsuarioAdmin: () => {}
  });