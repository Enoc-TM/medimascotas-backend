// src/context/AuthContext.jsx
// Contexto global de autenticación en React
import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion, registrar, obtenerPerfil, eliminarPerfil } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Cargar usuario inicial si existe un token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    obtenerPerfil()
      .then((datosUsuario) => {
        setUser(datosUsuario);
      })
      .catch((err) => {
        console.error('Error al recuperar sesión activa:', err);
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Función de inicio de sesión
  const login = async (email, password) => {
    const respuesta = await iniciarSesion(email, password);
    localStorage.setItem('token', respuesta.token);
    setUser(respuesta.usuario);
    return respuesta;
  };

  // Función de registro
  const registerUser = async (datos) => {
    const respuesta = await registrar(datos);
    localStorage.setItem('token', respuesta.token);
    setUser(respuesta.usuario);
    return respuesta;
  };

  // Función para eliminar cuenta
  const deleteAccount = async () => {
    const respuesta = await eliminarPerfil();
    logout();
    return respuesta;
  };

  // Función para refrescar datos del usuario tras editar perfil
  const refreshUser = async () => {
    const datosActualizados = await obtenerPerfil();
    setUser(datosActualizados);
    return datosActualizados;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        registerUser,
        logout,
        deleteAccount,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
