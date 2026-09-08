const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const propietariosRoutes = require('./propietariosRoutes');
const mascotasRoutes = require('./mascotasRoutes');
const historialesRoutes = require('./historialesRoutes');
const consultasRoutes = require('./consultasRoutes');
const vacunasRoutes = require('./vacunasRoutes');

router.get('/', (req, res) => {
  res.json({
    nombre: 'API REST MediMascotas',
    descripcion: 'Sistema de Gestion de Historial Clinico Veterinario',
    version: '1.0.0',
    arquitectura: 'Monolito modular con Express 5',
    endpoints_disponibles: {
      auth: '/api/auth',
      propietarios: '/api/propietarios',
      mascotas: '/api/mascotas',
      historiales: '/api/historiales',
      consultas: '/api/consultas',
      vacunas: '/api/vacunas'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/propietarios', propietariosRoutes);
router.use('/mascotas', mascotasRoutes);
router.use('/historiales', historialesRoutes);
router.use('/consultas', consultasRoutes);
router.use('/vacunas', vacunasRoutes);

module.exports = router;
