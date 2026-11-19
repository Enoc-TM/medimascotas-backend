// src/api/axios.js
// Configuración centralizada de Axios para peticiones HTTP
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de Solicitud (Request):
// Inyecta el token JWT en las cabeceras (headers) de forma automática si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response):
// Captura respuestas de error, especialmente 401 (token expirado o no autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/');
    // Si la sesión caducó o el token no es válido (y no es la pantalla de login/registro)
    if (error.response?.status === 401 && !isAuthRoute) {
      console.warn('Sesión expirada o no autorizada. Redirigiendo a Login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
