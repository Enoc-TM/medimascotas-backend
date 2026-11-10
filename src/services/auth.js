import api from '../api/axios';

export const registrar = (datos) => api.post('/auth/register', datos).then((r) => r.data);

export const iniciarSesion = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data); // { token }

export const obtenerPerfil = () => api.get('/users/profile').then((r) => r.data);

export const actualizarPerfil = (datos) => api.put('/users/update', datos).then((r) => r.data);
