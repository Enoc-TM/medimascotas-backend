import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion, obtenerPerfil } from '../services/auth';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Al abrir la app: si hay token guardado, recupera el perfil
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    obtenerPerfil()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token } = await iniciarSesion(email, password);
    localStorage.setItem('token', token);
    setUser(await obtenerPerfil());
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
