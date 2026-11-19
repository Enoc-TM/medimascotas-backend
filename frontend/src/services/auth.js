// src/services/auth.js
// Servicios que consumen las rutas de la API mediante la instancia configurada de Axios
import api from '../api/axios';

/**
 * 1. REGISTRAR: Envía datos para crear nuevo usuario en la base de datos
 * Ruta: POST /api/auth/register
 */
export const registrar = async (datos) => {
  const response = await api.post('/auth/register', datos);
  return response.data; // { mensaje, token, usuario }
};

/**
 * 2. LOGIN: Envía credenciales para autenticar y obtener el token JWT
 * Ruta: POST /api/auth/login
 */
export const iniciarSesion = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { mensaje, token, usuario }
};

/**
 * 3. OBTENER PERFIL: Consulta los datos del usuario autenticado en la base de datos
 * Ruta: GET /api/users/profile
 */
export const obtenerPerfil = async () => {
  const response = await api.get('/users/profile');
  return response.data; // { id, nombre, email, rol, telefono, fecha_creacion }
};

/**
 * 4. ACTUALIZAR PERFIL: Actualiza nombre y teléfono en la base de datos
 * Ruta: PUT /api/users/update
 */
export const actualizarPerfil = async (datos) => {
  const response = await api.put('/users/update', datos);
  return response.data; // { mensaje, usuario }
};

/**
 * 5. ELIMINAR PERFIL: Elimina permanentemente al usuario de la base de datos
 * Ruta: DELETE /api/users/delete
 */
export const eliminarPerfil = async () => {
  const response = await api.delete('/users/delete');
  return response.data; // { mensaje, eliminado: true }
};

/**
 * 6. OBTENER DASHBOARD: Consulta métricas y estado del sistema
 * Ruta: GET /api/users/dashboard
 */
export const obtenerDashboard = async () => {
  const response = await api.get('/users/dashboard');
  return response.data;
};
