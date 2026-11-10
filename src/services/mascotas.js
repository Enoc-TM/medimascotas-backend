import api from '../api/axios';

// CRUD de Mascotas (a partir de la página 15)
export const obtenerMascotas = () => api.get('/mascotas').then((r) => r.data);

export const obtenerMascotaPorId = (id) => api.get(`/mascotas/${id}`).then((r) => r.data);

export const crearMascota = (datos) => api.post('/mascotas', datos).then((r) => r.data);

export const actualizarMascota = (id, datos) => api.put(`/mascotas/${id}`, datos).then((r) => r.data);

export const eliminarMascota = (id) => api.delete(`/mascotas/${id}`).then((r) => r.data);
