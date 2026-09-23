// src/routes/index.js
// Enrutador principal de la API REST MediMascotas
// Orquesta todos los modulos del sistema con arquitectura monolito modular
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const propietariosRoutes = require('./propietariosRoutes');
const mascotasRoutes = require('./mascotasRoutes');
const historialesRoutes = require('./historialesRoutes');
const consultasRoutes = require('./consultasRoutes');
const diagnosticosRoutes = require('./diagnosticosRoutes');
const tratamientosRoutes = require('./tratamientosRoutes');
const medicamentosRoutes = require('./medicamentosRoutes');
const vacunasRoutes = require('./vacunasRoutes');
const recordatoriosRoutes = require('./recordatoriosRoutes');

router.get('/', (req, res) => {
  res.json({
    nombre: 'API REST MediMascotas',
    descripcion: 'Sistema de Gestion de Historial Clinico Veterinario',
    version: '2.0.0',
    arquitectura: 'Monolito modular MVC con Express 5 y MySQL',
    autores: ['Enoc Tamayo', 'Esteban Fierro', 'Santiago Avila'],
    endpoints_disponibles: {
      auth: '/api/auth',
      propietarios: '/api/propietarios',
      mascotas: '/api/mascotas',
      historiales: '/api/historiales',
      consultas: '/api/consultas',
      diagnosticos: '/api/diagnosticos',
      tratamientos: '/api/tratamientos',
      medicamentos: '/api/medicamentos',
      vacunas: '/api/vacunas',
      recordatorios: '/api/recordatorios'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/propietarios', propietariosRoutes);
router.use('/mascotas', mascotasRoutes);
router.use('/historiales', historialesRoutes);
router.use('/consultas', consultasRoutes);
router.use('/diagnosticos', diagnosticosRoutes);
router.use('/tratamientos', tratamientosRoutes);
router.use('/medicamentos', medicamentosRoutes);
router.use('/vacunas', vacunasRoutes);
router.use('/recordatorios', recordatoriosRoutes);

module.exports = router;
