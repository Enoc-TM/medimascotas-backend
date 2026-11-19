// src/services/mascotas.js
// Servicio centralizado de Axios para la gestión de Mascotas y Clientes
import api from '../api/axios';

// Obtener listado de mascotas (con filtros opcionales de búsqueda, especie o propietario)
export const obtenerMascotas = (params = {}) => {
  return api.get('/mascotas', { params }).then((res) => res.data);
};

// Obtener detalle de una mascota por su ID
export const obtenerMascotaPorId = (id) => {
  return api.get(`/mascotas/${id}`).then((res) => res.data);
};

// Crear una nueva mascota asociada a un cliente/propietario
export const crearMascota = (datos) => {
  return api.post('/mascotas', datos).then((res) => res.data);
};

// Actualizar información de una mascota
export const actualizarMascota = (id, datos) => {
  return api.put(`/mascotas/${id}`, datos).then((res) => res.data);
};

// Eliminar una mascota
export const eliminarMascota = (id) => {
  return api.delete(`/mascotas/${id}`).then((res) => res.data);
};

// Obtener lista de clientes / propietarios para el formulario
export const obtenerPropietarios = () => {
  return api.get('/propietarios').then((res) => res.data);
};
